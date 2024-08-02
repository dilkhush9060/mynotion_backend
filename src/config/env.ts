import dotenv from "dotenv";
dotenv.config();

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

export const configEnv = Object.freeze(_configEnv);
