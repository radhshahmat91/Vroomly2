/**
 * A thrown error carrying an HTTP status code. Anything thrown inside a
 * route wrapped in asyncHandler ends up here, then in middleware/error.js.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
