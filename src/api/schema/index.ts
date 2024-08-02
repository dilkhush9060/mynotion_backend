import * as z from "zod";

export const SignUpSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: z.string({ required_error: "Password is required" }).min(8, {
    message: "Password must be at least 8 characters",
  }),
  phone: z.string().optional(),
});

export const SignInSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: z.string({ required_error: "Password is required" }).min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const EmailSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
});

export const OtpSchema = z.object({
  otp: z
    .string({ required_error: "Otp is required" })
    .min(4, {
      message: "Otp must be at least 4 characters",
    })
    .max(6, {
      message: "Otp must be at most 6 characters",
    }),
});
