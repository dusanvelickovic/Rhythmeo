# rhythmeo

A full-stack music application built with Angular and NestJS.

## Quick Start with Docker (Recommended)

The easiest way to run the application:

```bash
./docker-start.sh
```

Or manually:

**Development mode:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Production mode:**
```bash
docker-compose up --build
```

See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

## Development server (Local)

To start a local development server without Docker, run:

```bash
npm run start:all
```

This starts both the Angular frontend (`http://localhost:4200`) and NestJS backend (`http://localhost:3000`).

Or run them separately:
```bash
npm start           # Frontend only
npm run start:server:watch  # Backend only
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
