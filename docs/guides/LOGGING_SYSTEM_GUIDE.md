# Centralized Logging System Documentation

## Overview

A comprehensive, centralized logging system that tracks all logs across the entire system (backend, frontend apps: task, grow, university) and displays them in a unified admin dashboard.

### Features

✅ **Multi-App Support**: Track logs from different applications (task, grow, university, backend)
✅ **Console Interception**: Automatically capture all console.log/warn/error calls
✅ **Request Tracking**: Track HTTP requests with duration, status, and user context
✅ **Different Log Levels**: info, warn, error, debug
✅ **Filtering & Search**: Filter by app, level, date range, module, user
✅ **Export**: Export logs to CSV format
✅ **Real-time Display**: View logs in real-time in the admin dashboard
✅ **Batch Processing**: Efficient batch log storage on frontend
✅ **Metadata Support**: Store additional context with logs

---

## Architecture

### Backend Components

#### 1. **Log Model** (`apps/backend/src/model/logModel.ts`)
MongoDB schema for storing logs with:
- Timestamp with index for efficient querying
- Log level (info, warn, error, debug)
- App name (task, grow, university, backend)
- Module (optional, for categorization)
- Message and metadata
- Stack trace (for errors)
- Request context (requestId, URL, method, user, status, duration)

#### 2. **Logger Service** (`apps/backend/src/services/loggerService.ts`)
Core logging service providing:
- `logger.info()`, `logger.warn()`, `logger.error()`, `logger.debug()` methods
- `logger.logFromClient()` for frontend logs
- `logger.getLogs()` for querying with filters
- `logger.getLogStats()` for statistics
- `logger.clearOldLogs()` for maintenance
- Context management for tracking requests

#### 3. **Logging Routes** (`apps/backend/src/modules/logs/router.ts`)
RESTful API endpoints:
- `GET /api/logs` - Retrieve logs with filters
- `GET /api/logs/stats` - Get log statistics
- `POST /api/logs/client` - Record client logs
- `POST /api/logs/batch` - Batch insert logs
- `DELETE /api/logs` - Delete old logs
- `GET /api/logs/export` - Export logs as CSV

#### 4. **Console Interception** (`apps/backend/src/utils/consoleInterception.ts`)
Middleware for:
- Capturing all console.log/warn/error calls
- Automatic request logging with duration
- Request ID generation and context management
- Error logging with stack traces

### Frontend Components

#### 1. **Client Logger** (`libs/shared/utils/clientLogger.ts`)
Browser-side logging utility:
- `clientLogger.info()`, `clientLogger.warn()`, `clientLogger.error()`, `clientLogger.debug()`
- Automatic batching of logs (50 logs or 5 seconds)
- Automatic error handler setup
- Flush on page unload
- Error capturing (global errors and promise rejections)

#### 2. **Admin Logs Page** (`apps/university/src/pages/admin/Logs.tsx`)
Complete admin dashboard featuring:
- Tab-based view (All, Task, Grow, University, Backend)
- Real-time log filtering and search
- Date range filtering
- Log level filtering
- Expandable log details
- Pagination
- CSV export
- Log statistics

---

## Usage Guide

### Backend Logging

#### Basic Setup (Already Done)
Logging is automatically integrated in `app.ts`:
```typescript
// Console interception enabled
setupConsoleInterception();

// Request logging middleware added
app.use(requestLoggingMiddleware());

// Log routes registered
app.use('/api', logRouter);
```

#### Using Logger Service in Backend Code

```typescript
import { logger } from '../services/loggerService';

// Set request context (optional but recommended)
logger.setContext({
  userId: req.user?.id,
  requestId: 'abc123',
  module: 'auth',
});

// Log with different levels
logger.info('backend', 'User logged in successfully', {
  userId: 'user123',
  timestamp: new Date(),
});

logger.warn('backend', 'High memory usage detected', {
  memoryUsage: process.memoryUsage(),
});

logger.error('backend', 'Database connection failed', error, {
  connectionString: 'mongodb://...',
  attempt: 2,
});

logger.debug('backend', 'Query execution', {
  query: 'db.users.find()',
  duration: 45,
});

// Clear context after request
logger.clearContext();
```

#### Query Logs from Backend

```typescript
import { logger } from '../services/loggerService';

// Get all error logs from the past 24 hours
const result = await logger.getLogs({
  level: 'error',
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  limit: 100,
  skip: 0,
});

console.log(result.logs);
console.log(`Total: ${result.total}, Has More: ${result.hasMore}`);

// Get stats
const stats = await logger.getLogStats('backend');
```

### Frontend Logging

#### Initialize Client Logger

In your app entry point (e.g., `main.tsx`):

**For University App:**
```typescript
import { createClientLogger } from '@srk/shared/utils/clientLogger';

const logger = createClientLogger('university', '/api');
window.appLogger = logger;
```

**For Task App:**
```typescript
import { createClientLogger } from '@srk/shared/utils/clientLogger';

const logger = createClientLogger('task', '/api');
window.appLogger = logger;
```

**For Grow App:**
```typescript
import { createClientLogger } from '@srk/shared/utils/clientLogger';

const logger = createClientLogger('grow', '/api');
window.appLogger = logger;
```

#### Using Client Logger in Components

```typescript
import { window } from 'globalThis';

// In React component
export const MyComponent = () => {
  const handleClick = () => {
    // Log user action
    window.appLogger?.info('Button clicked', {
      buttonId: 'submit-btn',
      formData: { ... },
    });
  };

  return <button onClick={handleClick}>Submit</button>;
};
```

#### Automatic Error Tracking

Errors are automatically tracked:
```typescript
// These are captured automatically
throw new Error('Something went wrong');
Promise.reject(new Error('Async error'));
console.error('Manual error');
```

#### Manual Log Flushing

```typescript
// Force immediate flush (e.g., before navigation)
await window.appLogger?.flushAndWait();
```

---

## Admin Dashboard

### Access the Logs Dashboard
Navigate to: `/admin/logs`

### Dashboard Features

#### 1. **App Tabs**
- **All**: View logs from all applications
- **Task**: Task app logs only
- **Grow**: Grow app logs only
- **University**: University app logs only
- **Backend**: Backend logs only

#### 2. **Filtering**
- **Log Levels**: Toggle between info, warn, error, debug
- **Search**: Search log messages
- **Date Range**: Filter by start and end date
- **Reset Filters**: Clear all filters at once

#### 3. **Log Table**
Displays:
- Timestamp
- Log level (color-coded)
- App name
- Module
- Message (truncated)
- View button for details

#### 4. **Expanded View**
Click "View" to see:
- Request ID
- URL and HTTP method
- Status code and duration
- User ID
- Full metadata as JSON
- Stack trace (for errors)

#### 5. **Pagination**
- Navigate through pages
- Configurable limit per page
- Shows total count and current range

#### 6. **Export**
Click "Export as CSV" to download logs matching current filters as a CSV file.

---

## Integration Examples

### Example 1: Log API Calls
```typescript
// In backend controller
import { logger } from '../services/loggerService';

export async function getUserProfile(req: any, res: any) {
  try {
    logger.setContext({
      userId: req.user.id,
      module: 'user',
    });

    logger.info('backend', `Fetching user profile for ${req.user.id}`);

    const user = await UserModel.findById(req.user.id);

    logger.info('backend', 'User profile fetched successfully', {
      userId: req.user.id,
      hasData: !!user,
    });

    res.json(user);
  } catch (error) {
    logger.error('backend', 'Failed to fetch user profile', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Example 2: Log User Actions
```typescript
// In React component (Frontend)
export const LoginForm = () => {
  const handleSubmit = async (credentials) => {
    try {
      window.appLogger?.info('Login attempt', {
        email: credentials.email,
        timestamp: new Date(),
      });

      const response = await api.post('/auth/login', credentials);

      window.appLogger?.info('Login successful', {
        userId: response.data.userId,
      });

      // Handle success
    } catch (error) {
      window.appLogger?.error('Login failed', { error: error.message });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### Example 3: Log Financial Transactions
```typescript
// In backend service
import { logger } from '../services/loggerService';

export async function processPayment(paymentData) {
  const requestId = generateRequestId();

  logger.setContext({
    requestId,
    module: 'payment',
    userId: paymentData.userId,
  });

  logger.info('backend', 'Processing payment', {
    amount: paymentData.amount,
    currency: paymentData.currency,
  });

  try {
    const result = await paymentGateway.charge(paymentData);

    logger.info('backend', 'Payment processed successfully', {
      transactionId: result.id,
      amount: paymentData.amount,
      status: 'completed',
    });

    return result;
  } catch (error) {
    logger.error('backend', 'Payment processing failed', error, {
      amount: paymentData.amount,
      error: error.message,
    });

    throw error;
  }
}
```

---

## Database Cleanup

### Automatic Cleanup
Logs older than 30 days can be automatically cleaned up.

### Manual Cleanup
```typescript
import { logger } from '../services/loggerService';

// Delete logs older than 30 days
const result = await logger.clearOldLogs(30);
console.log(`Deleted ${result.deletedCount} old logs`);
```

### Schedule Regular Cleanup (Cron Job)
Add to `apps/backend/src/utils/cronjob/index.ts`:
```typescript
import { logger } from '../../services/loggerService';

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  const result = await logger.clearOldLogs(30);
  console.log(`[CRON] Cleaned up ${result.deletedCount} old logs`);
});
```

---

## Best Practices

1. **Always set context for requests**
   ```typescript
   logger.setContext({
     userId: req.user?.id,
     requestId: generateRequestId(),
     module: 'auth',
   });
   ```

2. **Include metadata for debugging**
   ```typescript
   logger.info('backend', 'User created', {
     email: user.email,
     status: user.status,
     plan: user.plan,
   });
   ```

3. **Use appropriate log levels**
   - `info`: Normal application flow
   - `warn`: Potentially problematic situations
   - `error`: Error conditions
   - `debug`: Detailed debugging information

4. **Log errors with stack traces**
   ```typescript
   try {
     // code
   } catch (error) {
     logger.error('backend', 'Operation failed', error);
   }
   ```

5. **Clear logs periodically**
   - Set up cron job to clean logs older than 30 days
   - Prevents database bloat

6. **Filter in admin dashboard for investigation**
   - Use date ranges to focus on specific time periods
   - Use search to find specific events
   - Group by app to isolate issues

---

## API Reference

### GET /api/logs
Retrieve logs with filtering.

**Query Parameters:**
- `app` (optional): 'task' | 'grow' | 'university' | 'backend' | 'all'
- `level` (optional): 'info' | 'warn' | 'error' | 'debug'
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `userId` (optional): Filter by user ID
- `search` (optional): Search in message
- `module` (optional): Filter by module
- `limit` (optional): Default 100
- `skip` (optional): Default 0

**Response:**
```json
{
  "logs": [...],
  "total": 1000,
  "limit": 100,
  "skip": 0,
  "hasMore": true
}
```

### POST /api/logs/client
Record a client log.

**Body:**
```json
{
  "app": "university",
  "level": "info",
  "message": "User action",
  "metadata": { "userId": "123" }
}
```

### GET /api/logs/stats
Get log statistics.

**Query Parameters:**
- `app` (optional): Filter by app

**Response:**
```json
[
  { "_id": "error", "count": 15 },
  { "_id": "warn", "count": 42 },
  { "_id": "info", "count": 1204 },
  { "_id": "debug", "count": 89 }
]
```

### GET /api/logs/export
Export logs as CSV.

**Query Parameters:** Same as GET /api/logs

---

## Troubleshooting

### Logs not appearing in dashboard
1. Check backend is running and MongoDB is connected
2. Verify `setupConsoleInterception()` is called in app.ts
3. Check browser console for errors when posting logs
4. Verify API URL is correct (`/api`)

### Missing console logs
1. Ensure console interception is enabled
2. Check for console.log calls that happen before interception is set up
3. Some libraries might override console methods

### Performance issues
1. Increase batch size in client logger (default 50)
2. Increase flush interval (default 5 seconds)
3. Archive old logs to separate collection
4. Add database indexes on frequently queried fields

### High database usage
1. Set up automatic log cleanup (30 days default)
2. Reduce log verbosity in production
3. Filter less critical logs by level

---

## Files Modified/Created

### New Files Created:
- `apps/backend/src/model/logModel.ts` - Log database model
- `apps/backend/src/services/loggerService.ts` - Backend logging service
- `apps/backend/src/modules/logs/router.ts` - API routes
- `apps/backend/src/utils/consoleInterception.ts` - Console interception middleware
- `libs/shared/utils/clientLogger.ts` - Frontend logging utility
- `apps/university/src/pages/admin/Logs.tsx` - Admin dashboard page

### Files Modified:
- `apps/backend/src/app.ts` - Added logging middleware and routes
- `apps/university/src/App.tsx` - Added Logs route
- `apps/university/src/Data/dashboardSidebar.ts` - Added Logs link to sidebar

---

## Support & Maintenance

For issues or questions:
1. Check the logs dashboard for error patterns
2. Review stack traces in expanded log view
3. Export logs for external analysis
4. Contact admin team with specific log IDs

---

Last Updated: May 20, 2026
Version: 1.0
