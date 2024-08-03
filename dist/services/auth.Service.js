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
exports.authService = void 0;
const repositories_1 = require("../repositories");
const config_1 = require("../config");
class AuthService {
    // sign up
    signUp(name, email, phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if user already exists
                const user = yield repositories_1.userRepository.getUserByEmail(email);
                if (user) {
                    return {
                        statusCode: 409,
                        message: "User already exists",
                    };
                }
                // hash password
                const hashedPassword = yield config_1.helpers.createBcryptHash(password);
                // generate otp
                const otp = yield config_1.helpers.generateOtp();
                // create token
                const token = yield config_1.helpers.createJwtToken({
                    email: email,
                }, config_1.configEnv.REFRESH_TOKEN_SECRET, "1h");
                // create user
                const userData = {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    otp,
                    token,
                };
                const newUser = yield repositories_1.userRepository.createUser(userData);
                // Todo: send email verification
                const mailBody = yield config_1.helpers.sendVerificationMail(name, otp);
                yield (0, config_1.sendMailByNodeMailer)({
                    to: email,
                    subject: "Verify your email",
                    mailBody: mailBody,
                });
                return {
                    statusCode: 201,
                    message: "Sign up success",
                    data: {
                        name: newUser.name,
                        email: newUser.email,
                        token: newUser.token,
                    },
                };
            }
            catch (error) {
                return {
                    statusCode: 500,
                    error,
                };
            }
        });
    }
    // email verification start
    sendVerificationMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check user exist
                const user = yield repositories_1.userRepository.getUserByEmail(email);
                if (!user) {
                    return {
                        statusCode: 404,
                        message: "User not found",
                    };
                }
                // check user is verified
                if (user.isVerified) {
                    return {
                        statusCode: 400,
                        message: "User is already verified",
                    };
                }
                // generate otp
                const otp = yield config_1.helpers.generateOtp();
                // create token
                const token = yield config_1.helpers.createJwtToken({
                    email: email,
                }, config_1.configEnv.REFRESH_TOKEN_SECRET, "1h");
                // update user
                const updatedUser = yield repositories_1.userRepository.updateUserByEmail(email, {
                    otp: otp,
                    token: token,
                });
                // sned mail
                const mailBody = yield config_1.helpers.sendVerificationMail(user.name, otp);
                yield (0, config_1.sendMailByNodeMailer)({
                    to: email,
                    subject: "Verify your email",
                    mailBody: mailBody,
                });
                return {
                    statusCode: 200,
                    message: "Send verification mail success",
                    data: {
                        email: user.email,
                        token,
                    },
                };
            }
            catch (error) {
                return {
                    statusCode: 500,
                    error,
                };
            }
        });
    }
    // email verification complete
    emailVerificationComplete(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check user exist
                const user = yield repositories_1.userRepository.getUserByEmail(email);
                if (!user) {
                    return {
                        statusCode: 404,
                        message: "User not found",
                    };
                }
                // check otp
                if (user.otp !== otp) {
                    return {
                        statusCode: 401,
                        message: "Invalid otp",
                    };
                }
                // update user
                const updatedUser = yield repositories_1.userRepository.updateUserByEmail(email, {
                    isVerified: true,
                    otp: null,
                    token: null,
                });
                return {
                    statusCode: 200,
                    message: "Email verification complete",
                    data: {
                        email: updatedUser.email,
                    },
                };
            }
            catch (error) {
                return {
                    statusCode: 500,
                    error,
                };
            }
        });
    }
    // sign in
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check user exist
                const user = yield repositories_1.userRepository.getUserByEmail(email);
                if (!user) {
                    return {
                        statusCode: 404,
                        message: "User not found",
                    };
                }
                // check user is verified
                if (!user.isVerified) {
                    return {
                        statusCode: 401,
                        message: "User not verified",
                    };
                }
                // check password
                const isPasswordCorrect = yield config_1.helpers.verifyBcryptHash(password, user.password);
                if (!isPasswordCorrect) {
                    return {
                        statusCode: 401,
                        message: "Invalid Credentials",
                    };
                }
                // generate jwt token
                const accessToken = yield config_1.helpers.createJwtToken({
                    email: user.email,
                }, config_1.configEnv.ACCESS_TOKEN_SECRET, "1d");
                const refreshToken = yield config_1.helpers.createJwtToken({
                    email: user.email,
                }, config_1.configEnv.REFRESH_TOKEN_SECRET, "3d");
                return {
                    statusCode: 200,
                    message: "Sign in success",
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        role: user.role,
                        accessToken,
                        refreshToken,
                    },
                };
            }
            catch (error) {
                return {
                    statusCode: 500,
                    error,
                };
            }
        });
    }
    // forgot password
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check user exist
                const user = yield repositories_1.userRepository.getUserByEmail(email);
                if (!user) {
                    return {
                        statusCode: 404,
                        message: "User not found",
                    };
                }
                // generate otp
                const otp = yield config_1.helpers.generateOtp();
                // create token
                const token = yield config_1.helpers.createJwtToken({
                    email: email,
                }, config_1.configEnv.REFRESH_TOKEN_SECRET, "1h");
                // update user
                const updatedUser = yield repositories_1.userRepository.updateUserByEmail(email, {
                    otp: otp,
                    token: token,
                });
                // sned mail
                const mailBody = yield config_1.helpers.sendForgotPasswordMail(user.name, otp);
                yield (0, config_1.sendMailByNodeMailer)({
                    to: email,
                    subject: "Reset your password",
                    mailBody: mailBody,
                });
                return {
                    statusCode: 200,
                    message: "Send forgot password mail success",
                    data: {
                        email: user.email,
                        token,
                    },
                };
            }
            catch (error) {
                return {
                    statusCode: 500,
                    error,
                };
            }
        });
    }
    // reset password
    resetPassword(email, otp, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check user exist
                const user = yield repositories_1.userRepository.getUserByEmail(email);
                if (!user) {
                    return {
                        statusCode: 404,
                        message: "User not found",
                    };
                }
                // check otp
                if (user.otp !== otp) {
                    return {
                        statusCode: 401,
                        message: "Invalid otp",
                    };
                }
                // hash password
                const hashedPassword = yield config_1.helpers.createBcryptHash(password);
                // update user
                const updatedUser = yield repositories_1.userRepository.updateUserByEmail(email, {
                    password: hashedPassword,
                    otp: null,
                    token: null,
                });
                return {
                    statusCode: 200,
                    message: "Reset password success",
                    data: {
                        email: updatedUser.email,
                    },
                };
            }
            catch (error) {
                return {
                    statusCode: 500,
                    error,
                };
            }
        });
    }
}
exports.authService = new AuthService();
