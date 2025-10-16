# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Database Setup (Choose one)

**PostgreSQL + TypeORM:**
```bash
# Run database containers
docker compose up -d postgres adminer maildev

# Run migrations
npm run migration:run

# Run seeds
npm run seed:run:relational

# Generate new migration
npm run migration:generate -- src/database/migrations/MigrationName

# Revert migration
npm run migration:revert
```

**MongoDB + Mongoose:**
```bash
# Run database containers
docker compose -f docker-compose.document.yaml up -d mongo mongo-express maildev

# Run seeds
npm run seed:run:document
```

### Core Development
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Start with SWC (faster compilation)
npm run start:swc

# Build for production
npm run build

# Start production server
npm run start:prod
```

### Testing
```bash
# Unit tests
npm run test

# Run specific test file
npm run test -- path/to/test.spec.ts

# E2E tests (requires .env setup)
npm run test:e2e

# Tests with coverage
npm run test:cov

# Docker E2E tests
npm run test:e2e:relational:docker  # For PostgreSQL
npm run test:e2e:document:docker    # For MongoDB
```

### Code Quality
```bash
# Lint code (automatically runs after migrations and resource generation)
npm run lint

# Format code
npm run format
```

### Resource Generation (CLI)
```bash
# Generate resource for relational DB
npm run generate:resource:relational

# Generate resource for document DB  
npm run generate:resource:document

# Generate resource for both DBs
npm run generate:resource:all-db

# Add property to existing resources
npm run add:property:to-all-db
npm run add:property:to-relational
npm run add:property:to-document
```

## Architecture

This boilerplate implements **Hexagonal Architecture** (Ports and Adapters) to separate business logic from infrastructure. It supports both TypeORM (PostgreSQL) and Mongoose (MongoDB) through a unified domain layer.

### Module Structure
```
module/
├── domain/           # Business entities (database-agnostic)
│   └── entity.ts
├── dto/             # Data Transfer Objects
├── infrastructure/  # External dependencies
│   └── persistence/
│       ├── document/        # MongoDB implementation
│       │   ├── entities/    # Mongoose schemas
│       │   ├── mappers/     # Domain ↔ DB mapping
│       │   └── repositories/
│       ├── relational/      # PostgreSQL implementation
│       │   ├── entities/    # TypeORM entities
│       │   ├── mappers/     # Domain ↔ DB mapping
│       │   └── repositories/
│       └── repository.ts    # Port interface
├── controller.ts
├── service.ts
└── module.ts
```

### Key Patterns

1. **Repository Pattern**: Each module defines a port interface (`infrastructure/persistence/repository.ts`) with concrete implementations for each database type.

2. **Mapper Pattern**: Mappers convert between domain entities and database entities, ensuring the domain layer remains database-agnostic.

3. **Dependency Injection**: The active database is determined by environment configuration (`DATABASE_TYPE` or presence of `isDocumentDatabase` flag).

## Environment Configuration

Copy the appropriate example file:
- `env-example-relational` for PostgreSQL/TypeORM
- `env-example-document` for MongoDB/Mongoose

Key environment variables:
- `NODE_ENV`: development | production | test
- `DATABASE_HOST`: Database host (use `localhost` for local development)
- `DATABASE_URL`: MongoDB connection string (for document DB)
- `AUTH_JWT_SECRET`: JWT secret for authentication
- `AUTH_JWT_TOKEN_EXPIRES_IN`: JWT expiration time
- `MAIL_HOST`: Mail server host (use `localhost` for local maildev)

## Authentication

Supports multiple auth strategies:
- Email/password with JWT
- Social auth (Google, Facebook, Apple)
- Anonymous strategy for public endpoints

Auth flow uses JWT with refresh tokens. Protected routes use `@UseGuards(AuthGuard('jwt'))`.

## File Uploads

Configurable storage drivers:
- Local storage
- AWS S3
- S3 with presigned URLs

Set `FILE_DRIVER` in `.env` to switch between storage providers.

## Testing Strategy

- **Unit tests**: Test individual services and components
- **E2E tests**: Test complete API flows with real database
- Test files follow `*.spec.ts` pattern for unit tests
- E2E tests in `test/` directory

## API Documentation

Swagger available at `http://localhost:3000/docs` when running locally.

## Database Migrations (TypeORM only)

Migrations track schema changes. Always generate migrations after modifying entities:
1. Make entity changes
2. Run `npm run migration:generate -- src/database/migrations/DescriptiveName`
3. Review generated migration
4. Run `npm run migration:run` to apply

## Validation

Uses `class-validator` decorators on DTOs. Validation pipe configured globally with whitelist and transform options.