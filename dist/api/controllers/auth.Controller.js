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
exports.authController = void 0;
const services_1 = require("../../services");
const errors_1 = require("../../api/errors");
const schema_1 = require("../schema");
class AuthController {
    // sign up
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = schema_1.SignUpSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.ZodHttpError(error));
            }
            const response = yield services_1.authService.signUp(data.name, data.email, data.phone, data.password);
            if (response.statusCode === 201) {
                if (response.data) {
                    res.cookie("token", response.data.token, {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                }
                return res.status(201).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // email verification start
    sendVerificationMail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = schema_1.EmailSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.ZodHttpError(error));
            }
            const response = yield services_1.authService.sendVerificationMail(data.email);
            if (response.statusCode === 200) {
                if (response.data) {
                    res.cookie("token", response.data.token, {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                }
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // email verification complete
    emailVerificationComplete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = req.tokenData;
            // data validation
            const { data, error } = schema_1.OtpSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.ZodHttpError(error));
            }
            const response = yield services_1.authService.emailVerificationComplete(tokenData.email, data.otp);
            if (response.statusCode === 200) {
                // clear cookies
                res.clearCookie("token");
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // sign in
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = schema_1.SignInSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.ZodHttpError(error));
            }
            const response = yield services_1.authService.signIn(data.email, data.password);
            if (response.statusCode === 200) {
                // set cookies
                if (response.data) {
                    res.cookie("accessToken", response.data.accessToken, {
                        maxAge: 1000 * 60 * 60 * 24,
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                    res.cookie("refreshToken", response.data.refreshToken, {
                        maxAge: 1000 * 60 * 60 * 24 * 3,
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                }
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // forgot password
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = schema_1.EmailSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.ZodHttpError(error));
            }
            const response = yield services_1.authService.forgotPassword(data.email);
            if (response.statusCode === 200) {
                if (response.data) {
                    res.cookie("token", response.data.token, {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                }
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // reset password
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = req.tokenData;
            // data validation
            const { data, error } = schema_1.ResetPasswordSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.ZodHttpError(error));
            }
            const response = yield services_1.authService.resetPassword(tokenData.email, data.otp, data.password);
            if (response.statusCode === 200) {
                // clear cookies
                res.clearCookie("token");
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
}
exports.authController = new AuthController();
