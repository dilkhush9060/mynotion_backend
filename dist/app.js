"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const middlewares_1 = require("./api/middlewares");
const routes_1 = require("./api/routes");
function configureApp(app) {
    // express json and urlencoded
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // logger
    app.use(config_1.logger.httpExpress);
    // cors
    app.use((0, cors_1.default)({
        origin: ["http://localhost:3000", "https://mynotion-two.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        preflightContinue: true,
        optionsSuccessStatus: 204,
        credentials: true,
    }));
    //  cookies
    app.use((0, cookie_parser_1.default)());
    //  helmet
    app.use((0, helmet_1.default)());
    //  compression
    app.use((0, compression_1.default)());
    // routes
    app.use("/api/auth", routes_1.authRoutes);
    // health check
    app.get("/", (req, res) => {
        res.send("Hello, World!");
    });
    // 404 error handler
    app.use((req, res, next) => {
        res.status(404).json({
            message: "Not Found - 404",
        });
    });
    // global error handler
    app.use(middlewares_1.globalErrorHandle);
}
exports.default = configureApp;
