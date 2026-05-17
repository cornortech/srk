type TEnv = {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  DATABASE_NAME: string;
  IS_PROD: boolean;
  JWT_SECRET: string;
  FRONTEND_BASE_URL: string;
  TASK_FRONTEND_URL: string;
  GROW_FRONTEND_URL: string;
  COOKIE_DOMAIN?: string;
  WHITE_LISTED_ORIGINS: string;
  BANK_FRONTEND_URL: string;
  SMTP_PW: string;
  APP_EMAIL: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ENDPOINT: string;
  R2_BUCKET: string;
  CDN_BASE_URL: string;
  R2_PREFIX_FOLDER: string;
  // Firebase credentials removed - Cloudflare R2 is used instead
};

const getDatabaseNameFromUrl = (databaseUrl: string) => {
  if (!databaseUrl) return '';

  try {
    return new URL(databaseUrl).pathname.replace(/^\/+/, '') || '';
  } catch {
    const match = databaseUrl.match(/\/([^/?]+)(?:\?|$)/);
    return match?.[1] || '';
  }
};

export const env: TEnv = {
  NODE_ENV: process.env.NODE_ENV || '',
  PORT: process.env.PORT || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  DATABASE_NAME: getDatabaseNameFromUrl(process.env.DATABASE_URL || ''),
  IS_PROD: (process.env.IS_PROD === 'true') || process.env.PROD === 'srk',
  JWT_SECRET: process.env.JWT_SECRET || '',
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || '',
  TASK_FRONTEND_URL: process.env.TASK_FRONTEND_URL || '',
  GROW_FRONTEND_URL: process.env.GROW_FRONTEND_URL || '',
  WHITE_LISTED_ORIGINS: process.env.WHITE_LISTED_ORIGINS || '',
  BANK_FRONTEND_URL: process.env.BANK_FRONTEND_URL || '',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  APP_EMAIL: process.env.APP_EMAIL || '',
  SMTP_PW: process.env.SMTP_PW || '',
  R2_ACCESS_KEY_ID:
    process.env.R2_ACCESS_KEY_ID || 'daf464fc116a11847575b6fbfbac26a0',
  R2_SECRET_ACCESS_KEY:
    process.env.R2_SECRET_ACCESS_KEY ||
    '6414fef2c8ca3715856b08ab2302d1d92e80b7cec32971acc0d85cef559fd4e4',
  R2_ENDPOINT:
    process.env.R2_ENDPOINT ||
    'https://5f09c9e5753d5a473d39fed1135fef46.r2.cloudflarestorage.com',
  R2_BUCKET: process.env.R2_BUCKET || 'srk',
  CDN_BASE_URL: process.env.CDN_BASE_URL || 'https://cdn.thesrkuniversity.com',
  R2_PREFIX_FOLDER:
    (process.env.IS_PROD === 'true' || process.env.PROD === 'srk') ? 'srk' : 'dev',
  // Firebase config intentionally omitted
};

// Validates required environment variables and throws an error listing missing ones.
export function validateEnv() {
  const requiredKeys: Array<keyof TEnv> = [
    'DATABASE_URL',
    'JWT_SECRET',
    'FRONTEND_BASE_URL',
    'APP_EMAIL',
    'SMTP_PW',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_ENDPOINT',
    'R2_BUCKET',
    'CDN_BASE_URL',
  ];

  const missing = requiredKeys.filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
