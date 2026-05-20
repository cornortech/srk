import axios, { AxiosInstance } from 'axios';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
export type AppName = 'task' | 'grow' | 'university' | 'backend';

interface ClientLogConfig {
  appName: AppName;
  apiUrl?: string;
  batchSize?: number;
  flushInterval?: number;
}

class ClientLogger {
  private appName: AppName;
  private apiUrl: string;
  private apiClient: AxiosInstance;
  private logBatch: Array<{
    app: AppName;
    level: LogLevel;
    message: string;
    metadata?: Record<string, any>;
    timestamp: string;
  }> = [];
  private batchSize: number;
  private flushInterval: number;
  private flushTimer: NodeJS.Timeout | null = null;
  private isFlushing = false;

  constructor(config: ClientLogConfig) {
    this.appName = config.appName;
    this.apiUrl = config.apiUrl || '/api';
    this.batchSize = config.batchSize || 50;
    this.flushInterval = config.flushInterval || 5000; // 5 seconds

    this.apiClient = axios.create({
      baseURL: this.apiUrl,
      timeout: 3000, // Reduced timeout for faster failure
    });

    // Intercept unhandled errors
    this.setupErrorHandlers();
  }

  private setupErrorHandlers() {
    // Handle global errors
    window.addEventListener('error', (event) => {
      this.error(
        `Uncaught error: ${event.message}`,
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        event.error
      );
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error(`Unhandled promise rejection: ${event.reason}`);
    });
  }

  private addToBatch(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>
  ) {
    this.logBatch.push({
      app: this.appName,
      level,
      message,
      metadata,
      timestamp: new Date().toISOString(),
    });

    // Flush if batch size reached
    if (this.logBatch.length >= this.batchSize) {
      this.scheduleFlush(0); // Flush immediately
    } else if (!this.flushTimer) {
      // Start flush timer if not already running
      this.scheduleFlush(this.flushInterval);
    }
  }

  private scheduleFlush(delay: number) {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }

    this.flushTimer = setTimeout(() => {
      this.flush().catch(() => {
        // Silent fail
      });
    }, delay);
  }

  private async flush() {
    if (this.logBatch.length === 0 || this.isFlushing) return;

    this.isFlushing = true;
    const batch = [...this.logBatch];
    this.logBatch = [];

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    // Send logs in background - don't wait for response
    try {
      // Use sendBeacon for best effort delivery, fallback to fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          `${this.apiUrl}/logs/batch`,
          JSON.stringify({ logs: batch })
        );
      } else {
        // Fallback to fetch with no-wait
        this.apiClient
          .post('/logs/batch', { logs: batch })
          .catch(() => {
            // Silent fail - we don't want logging errors to affect the app
          });
      }
    } finally {
      this.isFlushing = false;
    }
  }

  // Non-blocking methods - return immediately
  info(message: string, metadata?: Record<string, any>) {
    console.log(`[${this.appName.toUpperCase()}] ${message}`, metadata || '');
    this.addToBatch('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    console.warn(`[${this.appName.toUpperCase()}] ${message}`, metadata || '');
    this.addToBatch('warn', message, metadata);
  }

  error(message: string, metadata?: Record<string, any>, error?: Error) {
    console.error(`[${this.appName.toUpperCase()}] ${message}`, error || '', metadata || '');
    this.addToBatch('error', message, {
      ...metadata,
      errorMessage: error?.message,
      errorStack: error?.stack,
    });
  }

  debug(message: string, metadata?: Record<string, any>) {
    console.log(`[${this.appName.toUpperCase()}] [DEBUG] ${message}`, metadata || '');
    this.addToBatch('debug', message, metadata);
  }

  // Flush and wait - use only before critical operations like navigation
  async flushAndWait() {
    await this.flush();
    // Wait for any pending requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Create singleton instances for each app
export const createClientLogger = (appName: AppName, apiUrl?: string) => {
  return new ClientLogger({
    appName,
    apiUrl,
    batchSize: 50,
    flushInterval: 5000,
  });
};

// Export for global usage
declare global {
  interface Window {
    appLogger?: ClientLogger;
  }
}

// Flush logs on page unload with best-effort delivery
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (window.appLogger) {
      // Use sendBeacon for best effort delivery
      window.appLogger.flushAndWait().catch(() => {
        // Silent fail
      });
    }
  });
}
