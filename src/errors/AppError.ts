import { ErrorCodes, type ErrorCode } from './error-codes.js'

/*
  PATH /src/errors/AppError.js
*/
export interface AppErrorOptions {
  code?: ErrorCode
  details?: unknown
  cause?: unknown
}

/**
 * Custom error class for application-specific errors.
 * @class AppError
 * @extends Error
 * @param {string} message - Human-readable error message
 * @param {Object} [options]
 * @param {string} [options.code='APP_ERROR'] - Machine-readable error code
 * @param {any} [options.details=null] - Additional details for debugging
 */

export class AppError extends Error {
  readonly code: ErrorCode
  readonly details: unknown

  constructor(
    message: string,
    { code = ErrorCodes.INTERNAL_ERROR, details = null, cause }: AppErrorOptions = {},
  ) {
    super(message, { cause })
    this.name = 'AppError'
    this.code = code
    this.details = details
    Error.captureStackTrace?.(this, this.constructor)
  }
}
