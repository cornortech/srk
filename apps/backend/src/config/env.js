"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || "",
    APP_EMAIL: process.env.APP_EMAIL || "",
    SMTP_PW: process.env.SMTP_PW || "",
};
