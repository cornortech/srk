# MongoDB Connection Issues - Fixed

## Problem
Your application had **96 active MongoDB connections**, which is dangerously high and can lead to:
- Connection pool exhaustion
- Performance degradation
- Potential database crashes
- Resource wastage

## Root Causes Identified

### 1. ❌ **Missing Connection Pool Configuration**
- **Issue**: No connection pooling limits were configured
- **Default Behavior**: MongoDB defaults to 100 connections per application instance
- **Risk**: Without proper limits, the application could create excessive connections
- **Fix**: Added connection pooling configuration with reduced limits

### 2. ❌ **Session Leak in `sendMoney` Function**
- **Location**: [apps/backend/src/modules/bank/mutation.ts](apps/backend/src/modules/bank/mutation.ts#L153)
- **Issue**: MongoDB sessions were created but not properly closed in all code paths
- **Problem**: The `session.endSession()` calls were in both try and catch blocks, but if an unhandled error occurred, sessions could leak
- **Fix**: Moved session cleanup to a `finally` block to guarantee execution

### 3. ⚠️ **No Graceful Shutdown Handler**
- **Issue**: When the application restarts or crashes, MongoDB connections weren't properly closed
- **Risk**: Orphaned connections remain active in MongoDB
- **Fix**: Added SIGTERM and SIGINT handlers to close connections gracefully

### 4. ⚠️ **No Connection Monitoring**
- **Issue**: No visibility into connection pool health
- **Risk**: Connection issues could go unnoticed
- **Fix**: Added monitoring utilities and health check endpoints

## Changes Made

### 1. Connection Pooling Configuration
**File**: [apps/backend/src/config/database.ts](apps/backend/src/config/database.ts)

```typescript
await mongoose.connect(uri, {
  maxPoolSize: 10,          // ✅ Reduced from default 100 to 10
  minPoolSize: 2,           // ✅ Maintain 2 connections minimum
  maxIdleTimeMS: 30000,     // ✅ Close idle connections after 30s
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

**Impact**: Limits maximum concurrent connections to 10 instead of 100

### 2. Fixed Session Leak in sendMoney
**File**: [apps/backend/src/modules/bank/mutation.ts](apps/backend/src/modules/bank/mutation.ts#L153)

**Before**:
```typescript
try {
  // ... transaction code
  await session.endSession(); // ❌ Only called on success
} catch (error) {
  await session.endSession(); // ❌ Only called on caught errors
}
// ❌ Missing finally block - unhandled errors leak sessions
```

**After**:
```typescript
try {
  // ... transaction code
} catch (error) {
  await session.abortTransaction();
} finally {
  await session.endSession(); // ✅ ALWAYS called
}
```

### 3. Graceful Shutdown
**File**: [apps/backend/src/main.ts](apps/backend/src/main.ts)

```typescript
// Handle SIGTERM and SIGINT
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const gracefulShutdown = async () => {
  // Close HTTP server
  // Close MongoDB connections
  // Exit process
};
```

### 4. Connection Monitoring
**New File**: [apps/backend/src/utils/dbMonitor.ts](apps/backend/src/utils/dbMonitor.ts)
- Added utilities to monitor connection health
- Periodic logging of connection stats
- New health check endpoint: `GET /health/db`

## Verification Steps

After restarting your backend:

1. **Check connection count in MongoDB**:
   ```bash
   # In MongoDB shell
   db.serverStatus().connections
   ```
   You should see significantly fewer connections (ideally ~10 per backend instance)

2. **Monitor connection health**:
   ```bash
   curl http://localhost:4000/health/db
   ```

3. **Check backend logs**:
   - Look for "Connected to MongoDB successfully with connection pooling"
   - Look for "Max pool size: 10, Min pool size: 2"
   - Connection stats will be logged every minute (dev) or 5 minutes (production)

4. **Test session cleanup**:
   - Make API calls to the sendMoney endpoint
   - Monitor that sessions are properly closed even if errors occur
   - Check MongoDB logs for any session warnings

## Expected Results

- **Before**: ~96 connections per backend instance
- **After**: ~10 connections maximum per backend instance (configured limit)
- **Session Leaks**: Eliminated
- **Connection Recovery**: Automatic cleanup on restart

## Additional Recommendations

### 1. Review All Transaction Code
Check if other functions using `mongoose.startSession()` follow the same pattern:
```typescript
const session = await mongoose.startSession();
try {
  await session.startTransaction();
  // ... transaction code
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession(); // ✅ Critical
}
```

**Already Correct**:
- ✅ [apps/backend/src/modules/grow/task/mutation.ts](apps/backend/src/modules/grow/task/mutation.ts#L836) - `reviewPaymentDetailsRequest`

**Fixed**:
- ✅ [apps/backend/src/modules/bank/mutation.ts](apps/backend/src/modules/bank/mutation.ts#L153) - `sendMoney`

### 2. Production Deployment
When deploying:
- Restart your backend service to apply the new connection pool settings
- Monitor connection counts for 24-48 hours
- Adjust `maxPoolSize` if needed based on your actual load

### 3. Load Testing
- Test under high load to verify connection pool doesn't exhaust
- If you see connection errors, you may need to increase `maxPoolSize`
- Rule of thumb: `maxPoolSize = expected concurrent requests / average request duration`

### 4. Consider Connection String Options
You can also set pool size in your MongoDB connection string:
```
mongodb://host/?maxPoolSize=10&minPoolSize=2
```

## Monitoring Checklist

✅ Connection pool size configured  
✅ Session cleanup guaranteed with finally blocks  
✅ Graceful shutdown handlers added  
✅ Connection health monitoring enabled  
✅ Health check endpoint added  
✅ Connection event listeners configured  

## Need to Restart?

**Yes**, you must restart your backend to apply these changes:
```bash
npm run start:backend
```

Watch for these log messages:
- "Connected to MongoDB successfully with connection pooling"
- "Max pool size: 10, Min pool size: 2"
- "🔍 Starting MongoDB connection pool monitoring"
