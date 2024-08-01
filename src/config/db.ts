import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";
import { Redis } from "ioredis";
import { configEnv } from "./env";

export const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info("Connected to database");
  } catch (error: any) {
    logger.error(error.message + "failed to connect to database");
  }
}

export const connectRedis = async () => {
  try {
    const redis = new Redis(configEnv.REDIS_URL);
    logger.info("Connected to Redis");
    return redis;
  } catch (error: any) {
    logger.error(error.message || "redis connection error");
    process.exit(1);
  }
};

export const disconnectRedis = async (redis: Redis) => {
  try {
    await redis.disconnect();
    logger.info("Disconnected from Redis");
  } catch (error: any) {
    logger.error(error.message || "redis disconnection error");
    process.exit(1);
  }
};
