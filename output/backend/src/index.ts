import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security Middleware
app.use(helmet()); // XSS and clickjacking protection
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/v1/tasks', taskRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/v1`);
});
