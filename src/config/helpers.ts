import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
}

export const helpers = new Helpers();
