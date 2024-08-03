"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger_1 = require("@rohit2005/logger");
const env_1 = require("./env");
exports.logger = new logger_1.Logger({
    logFiles: env_1.configEnv.NODE_ENV === 'development' ? false : true,
});
