"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRegistrationQueue = void 0;
const bullmq_1 = require("bullmq");
const config_1 = require("../config");
exports.newRegistrationQueue = new bullmq_1.Queue("new-registration", {
    connection: {
        host: config_1.configEnv.REDIS_URL.split(":")[0],
        port: Number(config_1.configEnv.REDIS_URL.split(":")[1]),
    },
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
    },
});
