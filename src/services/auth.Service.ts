import { IAuthService } from "@/types/services";
import { userRepository } from "@/repositories";
import { configEnv, helpers, sendMailByNodeMailer } from "@/config";

class AuthService implements IAuthService {
  // sign up
  public async signUp(
    name: string,
    email: string,
    phone?: string,
    password?: string
  ) {
    try {
      // check if user already exists
      const user = await userRepository.getUserByEmail(email);
      if (user) {
        return {
          statusCode: 409,
          message: "User already exists",
        };
      }

      // hash password
      const hashedPassword = await helpers.createBcryptHash(password!);

      // generate otp
      const otp = await helpers.generateOtp();

      // create token
      const token = await helpers.createJwtToken(
        {
          email: email,
        },
        configEnv.REFRESH_TOKEN_SECRET,
        "1h"
      );

      // create user
      const userData = {
        name,
        email,
        phone,
        password: hashedPassword,
        otp,
        token,
      };

      const newUser = await userRepository.createUser(userData);

      // Todo: send email verification
      const mailBody = await helpers.sendVerificationMail(name, otp);

      await sendMailByNodeMailer({
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
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  }

  // email verification start
  public async sendVerificationMail(email: string) {
    try {
      // check user exist
      const user = await userRepository.getUserByEmail(email);

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
      const otp = await helpers.generateOtp();

      // create token
      const token = await helpers.createJwtToken(
        {
          email: email,
        },
        configEnv.REFRESH_TOKEN_SECRET,
        "1h"
      );

      // update user
      const updatedUser = await userRepository.updateUserByEmail(email, {
        otp: otp,
        token: token,
      });

      // sned mail
      const mailBody = await helpers.sendVerificationMail(user.name, otp);

      await sendMailByNodeMailer({
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
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  }

  // email verification complete
  public async emailVerificationComplete(email: string, otp: string) {
    try {
      // check user exist
      const user = await userRepository.getUserByEmail(email);

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
      const updatedUser = await userRepository.updateUserByEmail(email, {
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
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  }

  // sign in
  public async signIn(email: string, password: string) {
    try {
      // check user exist
      const user = await userRepository.getUserByEmail(email);

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
      const isPasswordCorrect = await helpers.verifyBcryptHash(
        password,
        user.password!
      );

      if (!isPasswordCorrect) {
        return {
          statusCode: 401,
          message: "Invalid Credentials",
        };
      }

      // generate jwt token
      const accessToken = await helpers.createJwtToken(
        {
          email: user.email,
        },
        configEnv.ACCESS_TOKEN_SECRET,
        "1d"
      );

      const refreshToken = await helpers.createJwtToken(
        {
          email: user.email,
        },
        configEnv.REFRESH_TOKEN_SECRET,
        "3d"
      );

      return {
        statusCode: 200,
        message: "Sign in success",
        data: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  }

  // forgot password
  public async forgotPassword(email: string) {
    try {
      // check user exist
      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        return {
          statusCode: 404,
          message: "User not found",
        };
      }

      // generate otp
      const otp = await helpers.generateOtp();

      // create token
      const token = await helpers.createJwtToken(
        {
          email: email,
        },
        configEnv.REFRESH_TOKEN_SECRET,
        "1h"
      );

      // update user
      const updatedUser = await userRepository.updateUserByEmail(email, {
        otp: otp,
        token: token,
      });

      // sned mail
      const mailBody = await helpers.sendForgotPasswordMail(user.name, otp);

      await sendMailByNodeMailer({
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
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  }

  // reset password
  public async resetPassword(email: string, otp: string, password: string) {
    try {
      // check user exist
      const user = await userRepository.getUserByEmail(email);

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
      const hashedPassword = await helpers.createBcryptHash(password);

      // update user
      const updatedUser = await userRepository.updateUserByEmail(email, {
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
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  }
}
export const authService = new AuthService();
