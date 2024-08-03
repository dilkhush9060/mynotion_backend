"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configEnv = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const _configEnv = {
    // Server Ports
    PORT: process.env.PORT || 3000,
    // env
    NODE_ENV: process.env.NODE_ENV || "development",
    // Databases
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    // JWT
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "secret",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "secret",
    // SMTP
    SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
    SMTP_PORT: process.env.SMTP_PORT || 465,
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
    SMTP_SECURE: process.env.SMTP_SECURE || "false",
};
exports.configEnv = Object.freeze(_configEnv);
