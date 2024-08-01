import { IAuthService } from "@/types/services";
import { userRepository } from "@/repositories";
import { configEnv, helpers } from "@/config";

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
}
export const authService = new AuthService();
