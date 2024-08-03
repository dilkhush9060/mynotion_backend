"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSchema = exports.OtpSchema = exports.EmailSchema = exports.SignInSchema = exports.SignUpSchema = void 0;
const z = __importStar(require("zod"));
exports.SignUpSchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }).email({
        message: "Invalid email",
    }),
    password: z.string({ required_error: "Password is required" }).min(8, {
        message: "Password must be at least 8 characters",
    }),
    phone: z.string().optional(),
});
exports.SignInSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email({
        message: "Invalid email",
    }),
    password: z.string({ required_error: "Password is required" }).min(8, {
        message: "Password must be at least 8 characters",
    }),
});
exports.EmailSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email({
        message: "Invalid email",
    }),
});
exports.OtpSchema = z.object({
    otp: z
        .string({ required_error: "Otp is required" })
        .min(4, {
        message: "Otp must be at least 4 characters",
    })
        .max(6, {
        message: "Otp must be at most 6 characters",
    }),
});
exports.ResetPasswordSchema = z.object({
    otp: z
        .string({ required_error: "otp is required" })
        .min(4, {
        message: "minimum 4 digits",
    })
        .max(6, {
        message: "maximum 6 digits",
    }),
    password: z
        .string({ required_error: "password is required" })
        .min(8, {
        message: "minimum 8 characters",
    })
        .max(50, {
        message: "maximum 50 characters",
    }),
});
