import { Request, Response, NextFunction } from "express";

export type AppRequest = Request;
export type AppResponse = Response;
export type AppNextFunction = NextFunction;

declare global {
  namespace Express {
    interface Request {
      tokenData?: object;
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
