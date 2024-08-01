import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "My Notion",
    link: "https://mynotion-two.vercel.app",
    logo: "https://mynotion-two.vercel.app/favicon.ico",
    copyright: `Copyright © ${new Date().getFullYear()} My Notion`,
    logoHeight: "60",
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
    const otp = crypto.randomBytes(6).toString("hex");
    return otp;
  }

  // user verification mail template
  async sendVerificationMail(name: string, otp: string) {
    const email = {
      body: {
        name,
        intro: "Welcome to My Notion",
        otp,
        link: "https://mynotion-two.vercel.app/auth/email/verify",
        outro: "If you didn't request this email, please ignore it.",
      },
    };

    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }
}

export const helpers = new Helpers();
