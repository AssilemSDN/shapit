/*
  PATH /src/utils/safe-run.ts
*/
import { type ExitCode } from './exit-codes.js'
import { AppError } from '../errors/AppError.js'

export interface CommandResult<T = unknown> {
  success: boolean
  exitCode: ExitCode
  warnings: string[]
  data?: T
  error?: AppError
}

export interface CommandError {
  message: string
  code: string
  details?: unknown
}

export async function safeRun<T>(fn: () => Promise<CommandResult<T>>): Promise<CommandResult<T>> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        exitCode: error.exitCode,
        warnings: [],
        error,
      }
    }

    throw error
  }
}
