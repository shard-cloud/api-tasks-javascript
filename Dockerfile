# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && \
    npx prisma generate

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy dependencies and generated Prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy application code
COPY . .

# Generate Prisma client again (ensure it's available)
RUN npx prisma generate

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:${PORT:-80}/health').then(r => r.ok ? process.exit(0) : process.exit(1))" || exit 1

EXPOSE 80

CMD ["npm", "start"]

