"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.DatabaseError = exports.BadRequestHttpError = exports.ConflictHttpError = exports.NotFoundHttpError = exports.ForbiddenHttpError = exports.UnauthorizedHttpError = exports.JwtHttpError = exports.ZodHttpError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, statusCode, err) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.status = statusCode < 500 ? 'fail' : 'error';
        this.err = err;
    }
}
exports.HttpError = HttpError;
class ZodHttpError extends HttpError {
    constructor(error) {
        super(error.issues[0].message, 400, error);
    }
}
exports.ZodHttpError = ZodHttpError;
class JwtHttpError extends HttpError {
    constructor(message, err) {
        super(message, 401, err);
    }
}
exports.JwtHttpError = JwtHttpError;
class UnauthorizedHttpError extends HttpError {
    constructor(message, err) {
        super(message, 401, err);
    }
}
exports.UnauthorizedHttpError = UnauthorizedHttpError;
class ForbiddenHttpError extends HttpError {
    constructor(err) {
        super('Forbidden', 403, err);
    }
}
exports.ForbiddenHttpError = ForbiddenHttpError;
class NotFoundHttpError extends HttpError {
    constructor(message, err) {
        super(message, 404, err);
    }
}
exports.NotFoundHttpError = NotFoundHttpError;
class ConflictHttpError extends HttpError {
    constructor(message, err) {
        super(message, 409, err);
    }
}
exports.ConflictHttpError = ConflictHttpError;
class BadRequestHttpError extends HttpError {
    constructor(message, err) {
        super(message, 400, err);
    }
}
exports.BadRequestHttpError = BadRequestHttpError;
class DatabaseError extends HttpError {
    constructor(message, err) {
        super(message || 'Database error', 500, err);
    }
}
exports.DatabaseError = DatabaseError;
class InternalServerError extends HttpError {
    constructor(message, err) {
        super(message || 'Internal server error', 500, err);
    }
}
exports.InternalServerError = InternalServerError;
