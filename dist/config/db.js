"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.connectRedis = exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
const ioredis_1 = require("ioredis");
const env_1 = require("./env");
exports.prisma = new client_1.PrismaClient();
function connectDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.prisma.$connect();
            logger_1.logger.info("Connected to database");
        }
        catch (error) {
            logger_1.logger.error(error.message + "failed to connect to database");
        }
    });
}
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redis = new ioredis_1.Redis(env_1.configEnv.REDIS_URL);
        logger_1.logger.info("Connected to Redis");
        return redis;
    }
    catch (error) {
        logger_1.logger.error(error.message || "redis connection error");
        process.exit(1);
    }
});
exports.connectRedis = connectRedis;
const disconnectRedis = (redis) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis.disconnect();
        logger_1.logger.info("Disconnected from Redis");
    }
    catch (error) {
        logger_1.logger.error(error.message || "redis disconnection error");
        process.exit(1);
    }
});
exports.disconnectRedis = disconnectRedis;
