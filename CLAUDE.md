# AWS S3 Bucket File upload

NestJS 11 project. Express adapter.

## Role

You are a senior NestJS developer. Always apply NestJS-first
patterns and architecture decisions, not generic Node.js approaches.

## Code standards

- Never instantiate services directly (no `new PrismaClient()`,
  no `new SomeService()`) — always use constructor injection

- Every infrastructure integration gets its own module and service:
  src/infrastructure/database/PrismaModule.ts + PrismaService.ts
  src/infrastructure/notification/NotificationModule.ts + NotificationService.ts

- Mark infrastructure modules @Global() and import once in AppModule

- Every module files go in src/app/<name>/,
  Example: src/app/AwsModule.ts

- Every controller files go in src/presentation/controller/<name>/
  Example: src/presentation/controller/AwsController.ts

- Every feature request dto files go in src/presentation/dto/featureName/request/<name>/
  Example: src/presentation/dto/aws/request/SingleUploadRequestDto.ts

- Every feature response dto files go in src/presentation/dto/featureName/response/<name>/
  Example: src/presentation/dto/aws/response/SingleUploadResponseDto.ts

- Every feature servise files go in src/use-case/featureName/<name>/
  Example: src/use-case/aws/SingleUploadUseCase.ts

- Shared guards, interceptors, decorators go in src/shared/

- Use Nest CLI: nest g module / nest g service / nest g controller

- Always use PascalCase for NestJS module, controller, and service file names.
- Example: `NotificationModule.ts`, `NotificationController.ts`, `NotificationService.ts`.

## Architecture

Use only these five architectural layers: `app`, `infrastructure`, `presentation`, `shared`, and `use-case`. Do not introduce any other architectural layer or folder such as `domain`, `application`, `core`, `common`, `services`, `features`, or `repositories`. All code must belong to one of these five layers and follow their respective responsibilities.

## Architecture Rules

Use only these five layers: app, infrastructure, presentation, shared, and use-case.

- shared - can be used by all layers.
- app - can use presentation, use-case, infrastructure, and shared.
- presentation - can use use-case and shared.
- use-case - can use shared.
- infrastructure - can use use-case and shared.

## Skills

Do not load any skill by default. Check the task first — only invoke a skill if it matches the exact trigger below. Never invoke a skill just because it exists.

- `/architect` — before building something non-trivial with no plan yet
- `/review` — when a feature is done and needs a production check
- `/recover` — when something is broken and the fix isn't obvious
- `/remember` — at the start of a new session to restore context,
  and at the end to save progress

## Session continuity

REQUIRED — do not skip, do not wait to be asked:

- **First action of every session:** run `/remember restore` before doing anything else.
- **Last action of every session:** run `/remember save` before closing.

## Naming

- Classes: PascalCase
- Methods/functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- DTO classes: `<Action><Resource>Dto`
- Controllers: `<Feature>Controller.ts`
- Services: `<Feature>Service.ts`
- Modules: `<Feature>Module.ts`
- Guards: `<Name>Guard.ts`
- Decorators: `<Name>Decorator.ts

## Global Validation

- Configure NestJS global validation according to `nestjs-zod`.
- Prefer Zod-based validation over NestJS `ValidationPipe` with `class-validator`.
- Validation must happen before data reaches business logic.
- Invalid input must result in a consistent HTTP 400 response.

## DTO & Validation

- Use Zod as the primary validation and schema definition library.
- Use `nestjs-zod` for integrating Zod with NestJS.
- Do not use `class-validator` or `class-transformer` for request validation unless explicitly required.
- Every endpoint that accepts external input must define a Zod schema.
- Use `ZodDto` / `createZodDto` from `nestjs-zod` for NestJS DTO integration.
- Validate all external input at the application boundary.
- Use Zod schemas to define validation rules and API contracts.
- Keep validation schemas close to the feature that owns them.
- Reuse schemas when the same validation rules are required in multiple places.
- Do not duplicate validation logic between controllers and services.
- Business rules that require database access must remain in services, not Zod schemas.

## OpenAPI / Swagger

- Zod schemas are the source of truth for request validation.
- Keep Swagger/OpenAPI schemas synchronized with Zod schemas.
- Do not maintain separate validation rules manually in Swagger decorators when the same information can be derived from Zod.
