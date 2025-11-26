type TEnv = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  FRONTEND_BASE_URL: string;
  SMTP_PW: string;
  APP_EMAIL: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
};

export const env: TEnv = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || '',
  APP_EMAIL: process.env.APP_EMAIL || '',
  SMTP_PW: process.env.SMTP_PW || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_PRIVATE_KEY:
    process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '', // Handle newlines
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
};