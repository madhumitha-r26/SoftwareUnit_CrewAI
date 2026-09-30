import Fastify, { FastifyInstance } from 'fastify';
import '@fastify/cookie';
import '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import argon2 from 'argon2';
import crypto from 'crypto';
import { db } from './db';
import { RegisterSchema, LoginSchema } from './validation';

const fastify: FastifyInstance = Fastify({ logger: true });

// Plugins
fastify.register(import('@fastify/cookie'), { secret: process.env.REFRESH_SECRET });
fastify.register(import('@fastify/jwt'), { secret: process.env.JWT_SECRET });

fastify.register(swagger, {
  openapi: {
    info: { title: 'Auth API', version: '1.0.0' },
    paths: {},
  },
});
fastify.register(swaggerUi, { routePrefix: '/docs' });

// Helpers
const generateRefreshToken = () => crypto.randomBytes(40).toString('hex');
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

// Routes
fastify.post('/api/v1/auth/register', async (request, reply) => {
  try {
    const data = RegisterSchema.parse(request.body);
    
    // Check if email exists
    const { rows } = await db.query('SELECT user_id FROM users WHERE email = $1', [data.email]);
    if (rows.length > 0) {
      return reply.code(409).send({ error: 'EMAIL_EXISTS', message: 'Email is already in use' });
    }

    const passwordHash = await argon2.hash(data.password);
    
    await db.query(
      'INSERT INTO users (email, password_hash, tos_accepted, tos_version) VALUES ($1, $2, $3, $4)',
      [data.email, passwordHash, data.tosAgreed, process.env.TOS_VERSION]
    );

    return reply.code(201).send({ message: 'Account created successfully.' });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', details: err.errors });
    }
    return reply.code(500).send({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' });
  }
});

fastify.post('/api/v1/auth/login', async (request, reply) => {
  try {
    const { email, password } = LoginSchema.parse(request.body);
    
    const { rows } = await db.query('SELECT user_id, password_hash FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user || !(await argon2.verify(user.password_hash, password))) {
      return reply.code(401).send({ error: 'AUTH_FAILED', message: 'Invalid email or password' });
    }

    const accessToken = fastify.jwt.sign({ sub: user.user_id, role: 'user' }, { expiresIn: '15m' });
    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);

    // Store hashed refresh token
    await db.query(
      'INSERT INTO refresh_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
      [tokenHash, user.user_id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] // 7 days
    );

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 604800,
      path: '/',
    });

    return reply.send({ accessToken, expiresIn: 900 });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', details: err.errors });
    }
    return reply.code(401).send({ error: 'AUTH_FAILED', message: 'Invalid email or password' });
  }
});

fastify.post('/api/v1/auth/refresh', async (request, reply) => {
  const refreshToken = request.cookies.refreshToken;
  if (!refreshToken) {
    return reply.code(403).send({ error: 'SESSION_EXPIRED', message: 'Please log in again.' });
  }

  const tokenHash = hashToken(refreshToken);
  const { rows } = await db.query(
    'SELECT rt.token_hash, u.user_id FROM refresh_tokens rt JOIN users u ON rt.user_id = u.user_id WHERE rt.token_hash = $1 AND rt.revoked = false AND rt.expires_at > NOW()',
    [tokenHash]
  );

  if (rows.length === 0) {
    return reply.code(403).send({ error: 'SESSION_EXPIRED', message: 'Please log in again.' });
  }

  const user = rows[0];

  // Refresh Token Rotation: Revoke old token
  await db.query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [tokenHash]);

  const newAccessToken = fastify.jwt.sign({ sub: user.user_id, role: 'user' }, { expiresIn: '15m' });
  const newRefreshToken = generateRefreshToken();
  const newHash = hashToken(newRefreshToken);

  await db.query(
    'INSERT INTO refresh_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
    [newHash, user.user_id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  );

  reply.setCookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 604800,
    path: '/',
  });

  return reply.send({ accessToken: newAccessToken, expiresIn: 900 });
});

const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
