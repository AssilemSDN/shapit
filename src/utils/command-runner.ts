/*
  PATH /src/utils/command-runner.js
*/
import { logger } from "./logger.js";
import type { CommandResult } from "./safe-run.js";
import { ExitCodes } from "./exit-codes.js";

type CommandFunction<TOptions, TData = unknown> = (
  options: TOptions,
) => Promise<CommandResult<TData>>;

export async function runCommand<TOptions, TData = unknown>(
  commandName: string,
  commandFn: CommandFunction<TOptions, TData>,
  options: TOptions,
): Promise<void> {
  logger.info(`🚀 Starting ${commandName}...`);

  try {
    const result = await commandFn(options);

    process.exitCode = result.exitCode;

    for (const warning of result.warnings) {
      logger.warn(warning);
    }

    if (!result.success) {
      if (result.exitCode === ExitCodes.AUDIT_FAILED.code) {
        logger.error(`❌ ${commandName} found violations.`);
      } else {
        logger.error(`❌ ${commandName} failed.`);
      }

      return;
    }

    if (result.warnings.length > 0) {
      logger.warn(`⚠️ ${commandName} completed with warnings.`);
    } else {
      logger.info(`🎉 ${commandName} completed successfully!`);
    }

    if (result.data !== undefined) {
      logger.debug("Result:", result.data);
    }
  } catch (err: unknown) {
    logger.error(`❌ Unexpected error during ${commandName}:`, err);

    process.exitCode = ExitCodes.INTERNAL_ERROR.code;
  }
}
