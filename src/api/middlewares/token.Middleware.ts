import { AppRequest, AppResponse, AppNextFunction } from "@/types";
import { UnauthorizedHttpError } from "../errors";
import { configEnv, helpers } from "@/config";

export const tokenMiddleware = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNextFunction
) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies["token"];

  if (!token) {
    return next(new UnauthorizedHttpError("token not found"));
  }

  // verify token
  const tokenData: any = await helpers.verifyJwtToken(
    token,
    configEnv.REFRESH_TOKEN_SECRET
  );

  if (!tokenData) {
    return next(new UnauthorizedHttpError("token is invalid"));
  }

  req.tokenData = tokenData;
  return next();
};
