/*
  PATH /src/cli/command-runner.ts
*/
import { renderCommandResult } from './renderer/render-command-result.js'
import { renderUnexpectedError } from './renderer/render-unexpected-error.js'
import { ExitCodes } from '../utils/exit-codes.js'
import { logger } from '../utils/logger.js'
import type { CommandResult } from '../utils/safe-run.js'

export type CommandFunction<TOptions, TData = unknown> = (
  options: TOptions,
) => Promise<CommandResult<TData>>

export type RunCommandOptions<TOptions, TData = unknown> = {
  commandName: string
  commandFn: CommandFunction<TOptions, TData>
  options: TOptions
  renderData?: (data: TData) => void
  showCompletionMessage?: boolean
}

/**
 * Runs a command and renders its result to the console.
 *
 * @param options - The options for running the command.
 */
export async function runCommand<TOptions, TData = unknown>({
  commandName,
  commandFn,
  options,
  renderData,
  showCompletionMessage,
}: RunCommandOptions<TOptions, TData>): Promise<void> {
  logger.debug(`Starting ${commandName}...`)
  try {
    const result = await commandFn(options)
    renderCommandResult({
      commandName,
      result,
      renderData,
      showCompletionMessage,
    })
    process.exitCode = result.exitCode
  } catch (error: unknown) {
    // Unexpected bug
    renderUnexpectedError(commandName, error)
    process.exitCode = ExitCodes.ERROR.code
  }
}
