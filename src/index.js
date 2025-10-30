import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { logger } from "./lib/logger.js";
import tasksRoutes from "./routes/tasks.js";

const PORT = process.env.PORT || 80;
const NODE_ENV = process.env.NODE_ENV || "development";

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: ["error"], // Only log errors in production
});

// Initialize Fastify
const fastify = Fastify({
  logger,
  disableRequestLogging: NODE_ENV === "production",
});

// Register CORS
await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

// Health check endpoint
fastify.get("/health", async () => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    };
  } catch (error) {
    fastify.log.error(error, "Health check failed");
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    };
  }
});

// Register routes
await fastify.register(tasksRoutes, { prefix: "/tasks" });

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Internal Server Error" : error.message;

  reply.status(statusCode).send({
    error: true,
    message,
    statusCode,
  });
});

// 404 handler
fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: true,
    message: "Route not found",
    statusCode: 404,
  });
});

// Graceful shutdown
const closeGracefully = async (signal) => {
  fastify.log.info(`Received signal ${signal}, closing gracefully...`);

  await fastify.close();
  await prisma.$disconnect();

  process.exit(0);
};

process.on("SIGINT", () => closeGracefully("SIGINT"));
process.on("SIGTERM", () => closeGracefully("SIGTERM"));

// Start server
try {
  await fastify.listen({
    port: PORT,
    host: "0.0.0.0",
  });

  fastify.log.info(`Server listening on http://0.0.0.0:${PORT}`);
  fastify.log.info(`Environment: ${NODE_ENV}`);
} catch (err) {
  fastify.log.error(err);
  await prisma.$disconnect();
  process.exit(1);
}
