import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['pending', 'completed']).optional().default('pending'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['pending', 'completed']).optional(),
});

export const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: z.enum(['pending', 'completed']).optional(),
  search: z.string().optional(),
});

export const idSchema = z.object({
  id: z.string().uuid('Invalid task ID'),
});

// Validate function helper
export function validate(schema, data) {
  return schema.parse(data);
}

