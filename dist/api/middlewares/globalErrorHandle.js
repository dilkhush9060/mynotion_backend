"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandle = void 0;
const config_1 = require("../../config");
const globalErrorHandle = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status;
    err.message = err.message || "Internal Server Error";
    return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        status: err.status,
        message: err.message,
        error: config_1.configEnv.NODE_ENV == "development" ? err.err : null,
        stack: config_1.configEnv.NODE_ENV == "development" ? err.stack : null,
    });
};
exports.globalErrorHandle = globalErrorHandle;
