/*
  PATH /src/errors/AppError.js
*/
import { ErrorCodes, type ErrorCode } from './error-codes.js'

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
 * @param {AppErrorOptions} [options] - Optional parameters for the error
 * @param {ErrorCode} [options.code] - Specific error code from the predefined set
 * @param {unknown} [options.details] - Additional details about the error
 * @param {unknown} [options.cause] - Underlying cause of the error, if any
 */
export class AppError extends Error {
  readonly code: ErrorCode
  readonly details?: unknown

  constructor(
    message: string,
    { code = ErrorCodes.INTERNAL_ERROR, details, cause }: AppErrorOptions = {},
  ) {
    super(message, { cause })

    this.name = 'AppError'
    this.code = code
    this.details = details
  }
}
