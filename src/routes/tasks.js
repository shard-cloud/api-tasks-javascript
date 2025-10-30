import { TasksController } from '../controllers/tasks.controller.js';

const controller = new TasksController();

export default async function tasksRoutes(fastify) {
  // List all tasks
  fastify.get('/', controller.list.bind(controller));

  // Get task by ID
  fastify.get('/:id', controller.getById.bind(controller));

  // Create new task
  fastify.post('/', controller.create.bind(controller));

  // Update task (full)
  fastify.put('/:id', controller.update.bind(controller));

  // Update task (partial)
  fastify.patch('/:id', controller.patch.bind(controller));

  // Delete task
  fastify.delete('/:id', controller.delete.bind(controller));

  // Mark task as completed
  fastify.patch('/:id/complete', controller.complete.bind(controller));
}

