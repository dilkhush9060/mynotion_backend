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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailByNodeMailer = void 0;
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const errors_1 = require("../api/errors");
// create transporter
const transporter = nodemailer_1.default.createTransport({
    //@ts-ignore
    host: config_1.configEnv.SMTP_HOST,
    port: config_1.configEnv.SMTP_PORT,
    secure: config_1.configEnv.SMTP_SECURE === "true" ? true : false,
    auth: {
        user: config_1.configEnv.SMTP_USER,
        pass: config_1.configEnv.SMTP_PASS,
    },
});
const sendMailByNodeMailer = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, mailBody, }) {
    const mailOptions = {
        from: "My Notion <noreply@mynotion.com>",
        to: to || "",
        subject: subject,
        html: mailBody,
    };
    try {
        yield transporter.sendMail(mailOptions);
        config_1.logger.info("Mail sent successfully");
    }
    catch (error) {
        console.log(error);
        config_1.logger.error(error.message);
        throw new errors_1.InternalServerError(error.message, error);
    }
});
exports.sendMailByNodeMailer = sendMailByNodeMailer;
