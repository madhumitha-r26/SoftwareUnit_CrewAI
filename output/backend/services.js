const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Task } = require('./models');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-12345';
const BCRYPT_SALT_ROUNDS = 12;

const AuthService = {
  async signup(email, password) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error('USER_EXISTS');

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await User.create({ email, passwordHash });
    return { id: user.id, email: user.email };
  },

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      throw new Error('UNAUTHORIZED');
    }
  }
};

const TaskService = {
  async listTasks(userId, { status, page = 1 }) {
    const limit = 100; // NFR 6.1: Pagination limit
    const offset = (page - 1) * limit;
    const where = { userId };
    if (status) where.status = status;

    const { count, rows } = await Task.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return { tasks: rows, total: count };
  },

  async createTask(userId, { title, description }) {
    return await Task.create({ userId, title, description });
  },

  async updateTask(taskId, userId, updateData) {
    // Anti-Leak Pattern: Mandatory ownership filter in the WHERE clause
    const [affectedCount] = await Task.update(updateData, {
      where: { id: taskId, userId },
    });

    if (affectedCount === 0) {
      throw new Error('TASK_NOT_FOUND_OR_FORBIDDEN');
    }

    return await Task.findByPk(taskId);
  },

  async deleteTask(taskId, userId) {
    // Anti-Leak Pattern: Mandatory ownership filter
    const affectedCount = await Task.destroy({
      where: { id: taskId, userId },
    });

    if (affectedCount === 0) {
      throw new Error('TASK_NOT_FOUND_OR_FORBIDDEN');
    }
    return true;
  }
};

module.exports = { AuthService, TaskService };
