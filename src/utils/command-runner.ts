/*
  PATH /src/utils/command-runner.ts
*/
import { renderCommandResult } from '../cli/renderer/render-command-result.js'
import { renderUnexpectedError } from '../cli/renderer/render-unexpected-error.js'
import { ExitCodes } from './exit-codes.js'
import { logger } from './logger.js'
import type { CommandResult } from './safe-run.js'

export type CommandFunction<TOptions, TData = unknown> = (
  options: TOptions,
) => Promise<CommandResult<TData>>

export type RunCommandOptions<TOptions, TData = unknown> = {
  commandName: string
  commandFn: CommandFunction<TOptions, TData>
  options: TOptions
  renderData?: (data: TData) => void
}

export async function runCommand<TOptions, TData = unknown>({
  commandName,
  commandFn,
  options,
  renderData,
}: RunCommandOptions<TOptions, TData>): Promise<void> {
  logger.debug(`Starting ${commandName}...`)
  try {
    const result = await commandFn(options)
    renderCommandResult({
      commandName,
      result,
      renderData,
    })
    process.exitCode = result.exitCode
  } catch (error: unknown) {
    renderUnexpectedError(commandName, error)
    process.exitCode = ExitCodes.INTERNAL_ERROR.code
  }
}
