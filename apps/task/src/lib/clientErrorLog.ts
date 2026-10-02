import env from './env';

export interface ClientErrorReport {
  ref: string;
  step: string;
  code: string;
  message: string;
  detail?: string;
  status?: number | string;
  userId?: string | null;
  files?: string;
}

export const makeErrorRef = (): string =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

/**
 * Fire-and-forget report to the backend (logged as [CLIENT-ERROR]) so failures
 * that never reach the API can be traced from a user's reference code.
 */
export const reportClientError = (report: ClientErrorReport): void => {
  try {
    const connection = (navigator as unknown as {
      connection?: { effectiveType?: string; downlink?: number };
    }).connection;
    fetch(`${env.backendUrl}/client-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        ...report,
        app: 'task',
        online: navigator.onLine,
        network: connection
          ? `${connection.effectiveType ?? '?'}/${connection.downlink ?? '?'}Mbps`
          : null,
        url: window.location.pathname,
        ua: navigator.userAgent,
      }),
    }).catch(() => undefined);
  } catch {
    // reporting must never break the UI
  }
};
