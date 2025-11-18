export class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function errorHandler(err, req, res, next) {
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let details = err.details || null;

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
        details = err.errors;
    }

    if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized access';
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'An unexpected error occurred';
        details = null;
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

export function notFoundHandler(req, res, next) {
    const error = new ApiError(
        404,
        `Route not found: ${req.method} ${req.path}`
    );
    next(error);
}

export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}


export function validationError(message, details = null) {
    return new ApiError(400, message, details);
}

export function notFoundError(resource = 'Resource') {
    return new ApiError(404, `${resource} not found`);
}


export function unauthorizedError(message = 'Unauthorized access') {
    return new ApiError(401, message);
}

export function forbiddenError(message = 'Access forbidden') {
    return new ApiError(403, message);
}
export function rateLimitError(message = 'Too many requests, please try again later') {
    return new ApiError(429, message);
}

export default {
    ApiError,
    errorHandler,
    notFoundHandler,
    asyncHandler,
    validationError,
    notFoundError,
    unauthorizedError,
    forbiddenError,
    rateLimitError
};