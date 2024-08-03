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
exports.helpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const mailgen_1 = __importDefault(require("mailgen"));
const mailGenerator = new mailgen_1.default({
    theme: "salted",
    product: {
        name: "My Notion",
        link: "https://mynotion-two.vercel.app",
        logo: "https://mynotion-two.vercel.app/favicon.ico",
        copyright: `Copyright © ${new Date().getFullYear()} My Notion`,
        logoHeight: "80",
    },
    textDirection: "ltr",
});
class Helpers {
    createBcryptHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(12);
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
    verifyBcryptHash(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hash);
        });
    }
    createJwtToken(payload, secret, expiresIn) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(payload, secret, {
                expiresIn,
            });
        });
    }
    verifyJwtToken(token, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.verify(token, secret);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    generateOtp() {
        const otp = (0, crypto_1.randomBytes)(3).toString("hex");
        const otpNum = parseInt(otp, 16) % 1000000;
        const paddedOtp = otpNum.toString().padStart(6, "0");
        return paddedOtp;
    }
    // user verification mail template
    sendVerificationMail(name, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = {
                body: {
                    name,
                    intro: "Welcome to My Notion",
                    action: {
                        instructions: "Please click the button below to verify your email address.",
                        button: {
                            color: "#22BC66",
                            text: otp,
                            link: "https://mynotion-two.vercel.app/auth/email/verify?otp=" + otp,
                        },
                        outro: "If you didn't request this email, please ignore it.",
                    },
                },
            };
            const emailBody = mailGenerator.generate(email);
            return emailBody;
        });
    }
    // forgot password mail template
    sendForgotPasswordMail(name, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = {
                body: {
                    name,
                    intro: "Reset your password",
                    action: {
                        instructions: "Please click the button below to reset your password.",
                        button: {
                            color: "#22BC66",
                            text: otp,
                            link: "https://mynotion-two.vercel.app/auth/password/reset?otp=" + otp,
                        },
                        outro: "If you didn't request this email, please ignore it.",
                    },
                },
            };
            const emailBody = mailGenerator.generate(email);
            return emailBody;
        });
    }
}
exports.helpers = new Helpers();
