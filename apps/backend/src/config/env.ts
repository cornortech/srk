type TEnv = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  FRONTEND_BASE_URL: string;
  SMTP_PW: string;
  APP_EMAIL: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_CLIENT_EMAIL?: string;
  FIREBASE_PRIVATE_KEY?: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ENDPOINT: string;
  R2_BUCKET: string;
  CDN_BASE_URL: string;
};

export const env: TEnv = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || "",
  APP_EMAIL: process.env.APP_EMAIL || "",
  SMTP_PW: process.env.SMTP_PW || "",
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "",
  R2_ENDPOINT: process.env.R2_ENDPOINT || "",
  R2_BUCKET: process.env.R2_BUCKET || "",
  CDN_BASE_URL: process.env.CDN_BASE_URL || "",
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
