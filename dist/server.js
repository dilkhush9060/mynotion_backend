"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const config_1 = require("./config");
// import app and socket
const app_1 = __importDefault(require("./app"));
const socket_1 = __importDefault(require("./socket"));
// create app
exports.app = (0, express_1.default)();
// create server
exports.server = http_1.default.createServer(exports.app);
// create socket
const io = new socket_io_1.Server(exports.server);
// configure app and socket
(0, app_1.default)(exports.app);
(0, socket_1.default)(io);
// connect database
(0, config_1.connectDatabase)();
// listen to server
exports.server.listen(config_1.configEnv.PORT, () => {
    config_1.logger.info(`Server is running on port ${config_1.configEnv.PORT}`);
});
