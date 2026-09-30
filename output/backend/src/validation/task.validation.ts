import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  due_date: z.string().datetime().refine((date) => new Date(date) >= new Date(), {
    message: 'Deadline cannot be in the past',
  }),
  category: z.string().max(50).optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  due_date: z.string().datetime().optional(),
  category: z.string().max(50).optional(),
  is_completed: z.boolean().optional(),
});
