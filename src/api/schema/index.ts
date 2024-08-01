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
