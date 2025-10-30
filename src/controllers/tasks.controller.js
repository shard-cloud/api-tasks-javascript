import { prisma } from '../index.js';
import {
  validate,
  createTaskSchema,
  updateTaskSchema,
  querySchema,
  idSchema,
} from '../validators/task.validator.js';

export class TasksController {
  // GET /tasks - List all tasks with pagination and filters
  async list(request, reply) {
    try {
      const { page, limit, status, search } = validate(querySchema, request.query);

      const skip = (page - 1) * limit;

      // Build where clause
      const where = {};
      if (status) {
        where.status = status;
      }
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Execute queries in parallel
      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.task.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return reply.send({
        data: tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: true,
          message: 'Validation error',
          details: error.errors,
        });
      }
      throw error;
    }
  }

  // GET /tasks/:id - Get task by ID
  async getById(request, reply) {
    try {
      const { id } = validate(idSchema, request.params);

      const task = await prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        return reply.status(404).send({
          error: true,
          message: 'Task not found',
        });
      }

      return reply.send({ data: task });
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: true,
          message: 'Invalid task ID',
        });
      }
      throw error;
    }
  }

  // POST /tasks - Create new task
  async create(request, reply) {
    try {
      const data = validate(createTaskSchema, request.body);

      const task = await prisma.task.create({
        data,
      });

      return reply.status(201).send({ data: task });
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: true,
          message: 'Validation error',
          details: error.errors,
        });
      }
      throw error;
    }
  }

  // PUT /tasks/:id - Update task (full)
  async update(request, reply) {
    try {
      const { id } = validate(idSchema, request.params);
      const data = validate(updateTaskSchema, request.body);

      const task = await prisma.task.update({
        where: { id },
        data,
      });

      return reply.send({ data: task });
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: true,
          message: 'Validation error',
          details: error.errors,
        });
      }
      if (error.code === 'P2025') {
        return reply.status(404).send({
          error: true,
          message: 'Task not found',
        });
      }
      throw error;
    }
  }

  // PATCH /tasks/:id - Update task (partial)
  async patch(request, reply) {
    return this.update(request, reply);
  }

  // DELETE /tasks/:id - Delete task
  async delete(request, reply) {
    try {
      const { id } = validate(idSchema, request.params);

      await prisma.task.delete({
        where: { id },
      });

      return reply.status(204).send();
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: true,
          message: 'Invalid task ID',
        });
      }
      if (error.code === 'P2025') {
        return reply.status(404).send({
          error: true,
          message: 'Task not found',
        });
      }
      throw error;
    }
  }

  // PATCH /tasks/:id/complete - Mark task as completed
  async complete(request, reply) {
    try {
      const { id } = validate(idSchema, request.params);

      const task = await prisma.task.update({
        where: { id },
        data: { status: 'completed' },
      });

      return reply.send({ data: task });
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: true,
          message: 'Invalid task ID',
        });
      }
      if (error.code === 'P2025') {
        return reply.status(404).send({
          error: true,
          message: 'Task not found',
        });
      }
      throw error;
    }
  }
}

