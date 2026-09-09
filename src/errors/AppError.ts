import { ErrorCodes, type ErrorCode } from './error-codes.js'
import { ExitCodes, type ExitCode } from '../utils/exit-codes.js'

/*
  PATH /src/errors/AppError.js
*/
export interface AppErrorOptions {
  code?: ErrorCode
  exitCode?: ExitCode
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
  readonly exitCode: ExitCode
  readonly details?: unknown

  constructor(
    message: string,
    {
      code = ErrorCodes.INTERNAL_ERROR,
      exitCode = ExitCodes.INTERNAL_ERROR.code,
      details,
      cause,
    }: AppErrorOptions = {},
  ) {
    super(message, { cause })

    this.name = 'AppError'
    this.code = code
    this.exitCode = exitCode
    this.details = details
  }
}
