export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const isDuplicateKeyError = err?.code === 11000;

    if (isDuplicateKeyError) {
        const fields = Object.keys(err.keyPattern || err.keyValue || {}).join(", ") || "value";
        err = new ConflictError(`Duplicate ${fields}. Please use a different value.`);
    } else {
        console.error(err);
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict occurred") {
        super(message, 409);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
