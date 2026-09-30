import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { CreateTaskSchema, UpdateTaskSchema } from '../validation/task.validation';
import { AppError } from '../middleware/error.middleware';

export const getTasks = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { category, status } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params: any[] = [userId];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    if (status !== undefined) {
      params.push(status === 'completed');
      query += ` AND is_completed = $${params.length}`;
    }

    query += ' ORDER BY due_date ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validation = CreateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(400, 'VAL_001', validation.error.errors[0].message));
    }

    const { title, description, due_date, category } = validation.data;
    const userId = req.user.id;

    const query = `
      INSERT INTO tasks (user_id, title, description, due_date, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, title, description, due_date, category]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const validation = UpdateTaskSchema.safeParse(req.body);
    
    if (!validation.success) {
      return next(new AppError(400, 'VAL_001', validation.error.errors[0].message));
    }

    const updates = validation.data;
    const keys = Object.keys(updates);
    if (keys.length === 0) {
      return next(new AppError(400, 'VAL_002', 'No update fields provided'));
    }

    const setClause = keys.map((key, i) => `${key} = $${i + 3}`).join(', ');
    const values = Object.values(updates);

    const query = `
      UPDATE tasks 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND user_id = $2 
      RETURNING *
    `;

    const result = await pool.query(query, [id, userId, ...values]);

    if (result.rowCount === 0) {
      // SEC_001: Return 403/404 to avoid leaking task existence
      return next(new AppError(403, 'SEC_001', 'Resource not found'));
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);

    if (result.rowCount === 0) {
      return next(new AppError(403, 'SEC_001', 'Resource not found'));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
