import { authService } from "@/services";
import { HttpError, ZodHttpError } from "@/api/errors";
import { AppRequest, AppResponse, AppNextFunction } from "@/types";
import { EmailSchema, OtpSchema, SignInSchema, SignUpSchema } from "../schema";

class AuthController {
  // sign up
  public async signUp(
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) {
    const { data, error } = SignUpSchema.safeParse(req.body);

    if (error) {
      return next(new ZodHttpError(error));
    }

    const response = await authService.signUp(
      data.name,
      data.email,
      data.phone,
      data.password
    );

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
    } else {
      return next(new HttpError(response.message!, response.statusCode));
    }
  }

  // email verification start
  public async sendVerificationMail(
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) {
    const { data, error } = EmailSchema.safeParse(req.body);

    if (error) {
      return next(new ZodHttpError(error));
    }

    const response = await authService.sendVerificationMail(data.email);

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
    } else {
      return next(new HttpError(response.message!, response.statusCode));
    }
  }

  // email verification complete
  public async emailVerificationComplete(
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) {
    const tokenData: any = req.tokenData;
    // data validation
    const { data, error } = OtpSchema.safeParse(req.body);
    if (error) {
      return next(new ZodHttpError(error));
    }

    const response = await authService.emailVerificationComplete(
      tokenData.email,
      data.otp
    );

    if (response.statusCode === 200) {
      // clear cookies
      res.clearCookie("token");

      return res.status(200).json({
        statusCode: response.statusCode,
        message: response.message,
        data: response.data,
      });
    } else {
      return next(new HttpError(response.message!, response.statusCode));
    }
  }

  // sign in
  public async signIn(
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) {
    const { data, error } = SignInSchema.safeParse(req.body);

    if (error) {
      return next(new ZodHttpError(error));
    }

    const response = await authService.signIn(data.email, data.password);

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
    } else {
      return next(new HttpError(response.message!, response.statusCode));
    }
  }
}

export const authController = new AuthController();
