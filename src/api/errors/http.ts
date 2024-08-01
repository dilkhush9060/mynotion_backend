import { ZodError } from 'zod';

export class HttpError extends Error {
  statusCode: number;
  message: string;
  status: string;
  err: any;

  constructor(message: string, statusCode: number, err?: any) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.status = statusCode < 500 ? 'fail' : 'error';
    this.err = err;
  }
}

export class ZodHttpError extends HttpError {
  constructor(error: ZodError) {
    super(error.issues[0].message, 400, error);
  }
}

export class JwtHttpError extends HttpError {
  constructor(message: string, err?: any) {
    super(message, 401, err);
  }
}

export class UnauthorizedHttpError extends HttpError {
  constructor(message: string, err?: any) {
    super(message, 401, err);
  }
}

export class ForbiddenHttpError extends HttpError {
  constructor(err?: any) {
    super('Forbidden', 403, err);
  }
}

export class NotFoundHttpError extends HttpError {
  constructor(message: string, err?: any) {
    super(message, 404, err);
  }
}

export class ConflictHttpError extends HttpError {
  constructor(message: string, err?: any) {
    super(message, 409, err);
  }
}

export class BadRequestHttpError extends HttpError {
  constructor(message: string, err?: any) {
    super(message, 400, err);
  }
}

export class DatabaseError extends HttpError {
  constructor(message?: string, err?: any) {
    super(message || 'Database error', 500, err);
  }
}

export class InternalServerError extends HttpError {
  constructor(message?: string, err?: any) {
    super(message || 'Internal server error', 500, err);
  }
}
