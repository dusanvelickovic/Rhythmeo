# Stage 1: Build Angular frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files needed for Angular build
COPY angular.json ./
COPY tsconfig*.json ./
COPY src ./src
COPY public ./public

# Build Angular application
RUN npm run build

# Stage 2: Build NestJS backend
FROM node:22-alpine AS backend-build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy server source files
COPY server ./server
COPY ormconfig.ts ./
COPY ormconfig.js ./

# Build NestJS application
RUN npm run build:server

# Stage 3: Production image
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built Angular frontend from frontend-build stage
COPY --from=frontend-build /app/dist/rhythmeo/browser ./dist/client

# Copy built NestJS backend from backend-build stage
COPY --from=backend-build /app/server/dist ./dist

# Copy necessary config files
COPY ormconfig.js ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Command to run the application
CMD ["node", "dist/main.js"]
