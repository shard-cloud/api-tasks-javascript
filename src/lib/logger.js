import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = isDevelopment
  ? pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    })
  : pino({
      level: 'info',
    });

