/*
  PATH /src/utils/safe-run.ts
*/
import { ExitCodes, type ExitCode } from './exit-codes.js'
import { AppError } from '../errors/AppError.js'

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
}

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
            },
          ],
        }
      }
      throw error
    }
  }
}
