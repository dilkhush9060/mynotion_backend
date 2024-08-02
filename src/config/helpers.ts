import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
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
  async createBcryptHash(password: string) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  async verifyBcryptHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async createJwtToken(payload: object, secret: string, expiresIn: string) {
    return jwt.sign(payload, secret, {
      expiresIn,
    });
  }

  async verifyJwtToken(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  generateOtp() {
    const otp = randomBytes(3).toString("hex");
    const otpNum = parseInt(otp, 16) % 1000000;
    const paddedOtp = otpNum.toString().padStart(6, "0");
    return paddedOtp;
  }

  // user verification mail template
  async sendVerificationMail(name: string, otp: string) {
    const email = {
      body: {
        name,
        intro: "Welcome to My Notion",
        action: {
          instructions:
            "Please click the button below to verify your email address.",
          button: {
            color: "#22BC66",
            text: otp,
            link:
              "https://mynotion-two.vercel.app/auth/email/verify?otp=" + otp,
          },
          outro: "If you didn't request this email, please ignore it.",
        },
      },
    };

    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }

  // forgot password mail template
  async sendForgotPasswordMail(name: string, otp: string) {
    const email = {
      body: {
        name,
        intro: "Reset your password",
        action: {
          instructions: "Please click the button below to reset your password.",
          button: {
            color: "#22BC66",
            text: otp,
            link:
              "https://mynotion-two.vercel.app/auth/password/reset?otp=" + otp,
          },
          outro: "If you didn't request this email, please ignore it.",
        },
      },
    };
    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }
}

export const helpers = new Helpers();
