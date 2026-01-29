import mongoose from 'mongoose';

/**
 * Monitor MongoDB connection pool status
 * Call this periodically or on-demand to check connection health
 */
export const getConnectionPoolStats = () => {
  const connection = mongoose.connection;
  
  if (!connection || connection.readyState !== 1) {
    return {
      connected: false,
      readyState: connection?.readyState || 0,
      readyStateDescription: getReadyStateDescription(connection?.readyState || 0),
    };
  }

  // Get connection pool stats
  const db = connection.db;
  if (!db) {
    return {
      connected: true,
      readyState: connection.readyState,
      readyStateDescription: getReadyStateDescription(connection.readyState),
      warning: 'Database not available',
    };
  }

  return {
    connected: true,
    readyState: connection.readyState,
    readyStateDescription: getReadyStateDescription(connection.readyState),
    host: connection.host,
    port: connection.port,
    name: connection.name,
    // Note: Mongoose 6+ doesn't expose pool stats directly anymore
    // Connection pooling is managed internally by the MongoDB driver
  };
};

/**
 * Get human-readable description of connection state
 */
const getReadyStateDescription = (state: number): string => {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
};

/**
 * Log connection pool stats to console
 */
export const logConnectionPoolStats = () => {
  const stats = getConnectionPoolStats();
  console.log('📊 MongoDB Connection Stats:', JSON.stringify(stats, null, 2));
};

/**
 * Start periodic monitoring of connection pool
 * @param intervalMs - Interval in milliseconds (default: 60000 = 1 minute)
 */
export const startConnectionPoolMonitoring = (intervalMs = 60000) => {
  console.log(`🔍 Starting MongoDB connection pool monitoring (every ${intervalMs}ms)`);
  
  const interval = setInterval(() => {
    logConnectionPoolStats();
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
    console.log('🛑 Stopped MongoDB connection pool monitoring');
  };
};
