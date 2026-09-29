const express = require('express');
const { AuthService, TaskService } = require('./services');

const app = express();
app.use(express.json());

// Middleware: JWT Authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = AuthService.verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Auth Routes
app.post('/auth/signup', async (req, res) => {
  try {
    const user = await AuthService.signup(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (e) {
    const status = e.message === 'USER_EXISTS' ? 400 : 500;
    res.status(status).json({ error: e.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const result = await AuthService.login(req.body.email, req.body.password);
    res.status(200).json(result);
  } catch (e) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Task Routes
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const result = await TaskService.listTasks(req.userId, req.query);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/tasks', authenticate, async (req, res) => {
  try {
    const task = await TaskService.createTask(req.userId, req.body);
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await TaskService.updateTask(req.params.id, req.userId, req.body);
    res.json(task);
  } catch (e) {
    const status = e.message === 'TASK_NOT_FOUND_OR_FORBIDDEN' ? 403 : 500;
    res.status(status).json({ error: e.message });
  }
});

app.delete('/tasks/:id', authenticate, async (req, res) => {
  try {
    await TaskService.deleteTask(req.params.id, req.userId);
    res.status(204).send();
  } catch (e) {
    const status = e.message === 'TASK_NOT_FOUND_OR_FORBIDDEN' ? 403 : 500;
    res.status(status).json({ error: e.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend engine running on port ${PORT}`);
});
