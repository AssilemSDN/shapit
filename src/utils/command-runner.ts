/*
  PATH /src/utils/command-runner.js
*/

import { renderCommandResult } from "../cli/renderer/render-command-result.js";
import { renderUnexpectedError } from "../cli/renderer/render-unexpected-error.js";
import { ExitCodes } from "./exit-codes.js";
import { logger } from "./logger.js";
import type { CommandResult } from "./safe-run.js";

type CommandFunction<TOptions, TData = unknown> = (options: TOptions) => Promise<CommandResult<TData>>;

export async function runCommand<TOptions, TData = unknown>(
  commandName: string,
  commandFn: CommandFunction<TOptions, TData>,
  options: TOptions,
): Promise<void> {
  logger.debug(`Starting ${commandName}...`);
  try {
    const result = await commandFn(options);
    renderCommandResult({
      commandName,
      result,
    });
    process.exitCode = result.exitCode;
  } catch (error: unknown) {
    renderUnexpectedError(commandName, error);
    process.exitCode = ExitCodes.INTERNAL_ERROR.code;
  }
}