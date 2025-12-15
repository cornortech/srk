# SRK University - AI Agent Instructions

## Project Overview
This is an **Nx monorepo** housing a comprehensive learning management system with multiple frontend apps and a shared Express backend. The architecture emphasizes code sharing through TypeScript path aliases (`@srk/shared/*`) and type-safe API contracts.

## Architecture & Key Patterns

### 1. API Contract-First Design (ts-rest)
- **All APIs** are defined in `libs/shared/contracts/src/lib/` using `@ts-rest/core`
- Each domain (auth, task, course, etc.) has: `contract.ts` (API definition) + `schema.ts` (Zod validation)
- Backend implements contracts in `apps/backend/src/modules/[domain]/`:
  - `router.ts` - Maps contract to handlers
  - `mutation.ts` - POST/PATCH/DELETE handlers
  - `query.ts` - GET handlers
- Pattern: `contract → router → mutation/query handlers`
- Example: [contract.ts](libs/shared/contracts/src/lib/task/contract.ts) defines `taskContract`, implemented in [router.ts](apps/backend/src/modules/task/router.ts)

### 2. Shared Libraries Structure
```
libs/shared/
  ├── contracts/     # API contracts & Zod schemas (shared between frontend/backend)
  ├── types/         # TypeScript types
  ├── api/           # Frontend API client functions
  ├── hooks/         # React hooks (useTaskSSO, etc.)
  ├── store/         # Zustand state management
  ├── ui-components/ # Reusable React components
  └── utils/         # Shared utilities
```
- Import via TypeScript paths: `import { taskContract } from '@srk/shared/contracts'`
- Paths configured in `tsconfig.base.json`

### 3. Backend Module Pattern
Each backend module follows this structure:
```
apps/backend/src/modules/[domain]/
  ├── router.ts          # ts-rest router mapping
  ├── mutation.ts        # Write operations
  ├── query.ts           # Read operations
  └── (handlers export objects, not individual functions)
```
- Handlers use `AppRouteImplementationOrOptions<typeof contract.endpoint>`
- Always return structured responses: `{ status: number, body: { success: boolean, message: string } }`
- Models imported from `apps/backend/src/model/[name]Model.ts`

### 4. Mongoose Models
- Located in `apps/backend/src/model/`
- Naming: `[Entity]Model.ts` exports `[Entity]Model` (e.g., `UserModel`, `SocialTaskPackageModel`)
- All models use Mongoose schemas with timestamps: `{ timestamps: true }`

### 5. Frontend Apps
- **university** (port 4200) - Main learning platform
- **task** (port 5173) - Social task management  
- **grow** (port 5174) - Growth tracking
- Stack: React 18 + Vite 7 + TailwindCSS + NextUI + React Router 7
- Data fetching: TanStack Query (`useMutation`, `useQuery`)
- Forms: React Hook Form + Zod validation

## Development Workflows

### Starting Services
```bash
# Start all apps
npm run start:all

# Individual apps
npm run start:university    # Frontend on :4200
npm run start:backend       # Backend on :3000
npm run start:task         # Task app on :5173
npm run start:grow         # Grow app on :5174
```

### Environment Setup
1. Copy `apps/backend/example.env` to `apps/backend/.env`
2. Required variables: `DATABASE_URL`, `JWT_SECRET`, `APP_EMAIL`, `SMTP_PW`, `WHITE_LISTED_ORIGINS`
3. Generate JWT secret: `openssl rand -hex 32`

### Scripts
- `npm run create:admin` - Create admin user (uses `tsx` runner)
- `npm run seed:create-grow-packages` - Seed grow packages
- `npm run format` - Prettier format
- `npm run lint:all` - Lint all projects
- `npm run build:all` - Build all projects

### Testing & Building
- Tests: `npm run test:[app-name]` (Jest for backend, Vitest for frontend)
- Builds: `npm run build:[app-name]`
- Nx cache: Results cached for faster rebuilds

## Critical Conventions

### 1. API Response Structure
All endpoints must return:
```typescript
{
  status: 200 | 201 | 403 | 404 | 500,
  body: {
    success: boolean,
    message: string,
    result?: any,        // For successful queries
    details?: object     // Optional metadata
  }
}
```

### 2. Authentication
- JWT tokens stored in HTTP-only cookies (`x-auth-token`)
- Middleware: `apps/backend/src/utils/middleware.ts` exports `JwtAuthMiddleware`
- Adds `req.user = { userId, email }` to authenticated requests
- Used selectively per route (not globally applied)

### 3. Error Handling
- Try-catch blocks in all handlers
- Log errors with `console.error(error)` or `console.log(error)`
- Return 500 status with error message: `error.message ? \`Internal server error: ${error.message}\` : "Internal server error"`

### 4. Zod Schemas
- Define request/response schemas in `libs/shared/contracts/src/lib/[domain]/schema.ts`
- Export both schema and inferred type: `export type TCreateX = z.TypeOf<typeof createXSchema>`
- Used in contract definitions for validation

### 5. Database Patterns
- MongoDB connection in `apps/backend/src/config/database.ts`
- All timestamps: `{ timestamps: true }` in schemas
- Use `findOne`, `create`, `findOneAndUpdate` patterns
- Populate refs when needed: `.populate('userId')`

## Integration Points

### Cross-App Communication (SSO)
- `libs/shared/hooks/src/lib/useTaskSSO.ts` - SSO hook for task app
- Auth token exchange via `ssoContract` in contracts
- Backend SSO handlers in `apps/backend/src/modules/sso/`

### File Uploads
- Frontend: `useFileUpload` hook for Firebase/Cloudinary uploads
- Backend: Stores URLs in DB (not files)
- Pattern: Upload to cloud → save URL → display via URL

### Email Service
- `apps/backend/src/services/emailService.ts`
- Uses Nodemailer with Gmail SMTP
- Environment: `APP_EMAIL`, `SMTP_PW`

### PDF Generation
- Service: `apps/backend/src/services/pdfService.ts`
- Static files in `apps/backend/static/pdf/`

## Common Tasks

### Adding a New API Endpoint
1. Define contract in `libs/shared/contracts/src/lib/[domain]/contract.ts`
2. Add Zod schema if needed in `schema.ts`
3. Implement handler in `apps/backend/src/modules/[domain]/mutation.ts` or `query.ts`
4. Map in `router.ts`: `endpointName: handler.endpointName`
5. Handler pattern: Check for existing records → validate → perform operation → return structured response

### Adding a New Model
1. Create `apps/backend/src/model/[name]Model.ts`
2. Define Mongoose schema with required fields
3. Add `{ timestamps: true }` option
4. Export: `export const [Name]Model = mongoose.model("[Name]", schema)`

### Adding Shared Library Code
- UI components → `libs/shared/ui-components/`
- Hooks → `libs/shared/hooks/`
- Types → `libs/shared/types/`
- API clients → `libs/shared/api/`
- Remember to export from `index.ts` in each lib

## Troubleshooting

### Port Already in Use
Kill process: `lsof -ti:3000 | xargs kill -9` (replace 3000 with port)

### MongoDB Index Errors
Run: `npx tsx apps/backend/src/utils/script/dropUidIndex.ts`

### Nx Cache Issues
Clear cache: `nx reset`

### TypeScript Path Resolution
Restart TypeScript server in VS Code if imports not resolving: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
