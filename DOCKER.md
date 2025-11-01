# Docker Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- `.env` file configured (copy from `.env.example`)

## Development

Run the application in development mode with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**First time setup:** Angular build takes ~20 seconds on first start.

Access:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

Stop containers:
```bash
docker-compose -f docker-compose.dev.yml down
```

## Production

Run the application in production mode:

```bash
docker-compose up --build
```

Access:
- Application: http://localhost:3000

Stop containers:
```bash
docker-compose down
```

## Database Migrations

Run migrations inside the container:

```bash
# Development
docker exec -it rhythmeo-app-dev npm run migration:run

# Production
docker exec -it rhythmeo-app npm run migration:run
```

## Useful Commands

```bash
# View logs
docker-compose logs -f app

# Rebuild without cache
docker-compose build --no-cache

# Remove all volumes (⚠️ deletes database data)
docker-compose down -v

# Access container shell
docker exec -it rhythmeo-app-dev sh
```
