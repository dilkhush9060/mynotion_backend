import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";
export const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info("Connected to database");
  } catch (error: any) {
    logger.error(error.message + "failed to connect to database");
  }
}
