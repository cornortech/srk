import { Request, Response } from 'express';

// Lets the frontends report failures that never reach the API (e.g. the browser
// uploading straight to R2 on a bad mobile connection), so they can be debugged
// from the PM2 logs. Search for "[CLIENT-ERROR]".

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (value.resetAt < now) hits.delete(key);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
};

const clip = (value: unknown, max = 300): string | number | boolean | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  return String(value).slice(0, max);
};

export const clientLogHandler = (req: Request, res: Response) => {
  if (isRateLimited(req.ip ?? 'unknown')) {
    res.status(429).json({ success: false });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const entry = {
    ref: clip(body.ref, 20),
    app: clip(body.app, 30),
    step: clip(body.step, 60),
    code: clip(body.code, 40),
    message: clip(body.message, 300),
    detail: clip(body.detail, 400),
    status: clip(body.status, 10),
    userId: clip(body.userId, 60),
    online: clip(body.online, 10),
    network: clip(body.network, 40),
    files: clip(body.files, 200),
    url: clip(body.url, 200),
    ua: clip(body.ua, 250),
    ip: req.ip,
  };
  console.error('[CLIENT-ERROR]', JSON.stringify(entry));
  res.status(204).end();
};
