import { AppRequest, AppResponse, AppNextFunction } from "@/types";
import { HttpError } from "../errors";
import { configEnv } from "@/config";

export const globalErrorHandle = (
  err: HttpError,
  req: AppRequest,
  res: AppResponse,
  next: AppNextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;
  err.message = err.message || "Internal Server Error";

  return res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    error: configEnv.NODE_ENV == "development" ? err.err : null,
    stack: configEnv.NODE_ENV == "development" ? err.stack : null,
  });
};
