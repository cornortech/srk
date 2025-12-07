# @srk/shared/contracts

Shared API contracts using ts-rest for type-safe API calls between frontend and backend.

## Usage

### Backend (Express)

```typescript
import { createExpressEndpoints } from '@ts-rest/express';
import { ssoContract } from '@srk/shared/contracts';

createExpressEndpoints(ssoContract, handlers, router);
```

### Frontend (React)

```typescript
import { initClient } from '@ts-rest/core';
import { ssoContract } from '@srk/shared/contracts';

const client = initClient(ssoContract, {
  baseUrl: 'http://localhost:4000',
  baseHeaders: {},
});

// Type-safe API call
const response = await client.sso.getMe();
```

## Available Contracts

- `ssoContract` - SSO authentication endpoints
- `authContract` - Auth endpoints (login, register, etc.)

## Adding New Contracts

1. Create a new folder under `src/lib/` (e.g., `src/lib/task/`)
2. Add `contract.ts` with your endpoint definitions
3. Add `schema.ts` with Zod schemas
4. Export from `src/index.ts`
