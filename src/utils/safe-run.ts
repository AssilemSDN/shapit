/*
  PATH /src/utils/safe-run.ts
*/
import { ExitCodes, type ExitCode } from './exit-codes.js'
import { AppError } from '../errors/app-error.js'

export interface CommandResult<T = unknown> {
  success: boolean
  exitCode: ExitCode
  warnings: string[]
  errors?: CommandError[]
  data?: T
}

export interface CommandError {
  message: string
  code: string
  details?: unknown
  cause?: string
}

/**
 * Wraps a command function to handle AppError exceptions and return a standardized CommandResult.
 *
 * Unexpected errors are rethrown.
 *
 * @template TOptions - The type of the options parameter for the command function.
 * @template TData - The type of the data returned by the command function.
 * @param fn - The command function to wrap, which takes options and returns a Promise of CommandResult.
 * @returns A wrapped command returning a CommandResult.
 */
export function safeRun<TOptions, TData>(
  fn: (options: TOptions) => Promise<CommandResult<TData>>,
): (options: TOptions) => Promise<CommandResult<TData>> {
  return async (options) => {
    try {
      return await fn(options)
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return {
          success: false,
          exitCode: ExitCodes.ERROR.code,
          warnings: [],
          errors: [
            {
              message: error.message,
              code: error.code,
              details: error.details,
              cause: error.cause instanceof Error ? error.cause.message : undefined,
            },
          ],
        }
      }
      throw error
    }
  }
}
