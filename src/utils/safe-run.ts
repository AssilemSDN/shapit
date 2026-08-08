/*
  PATH /src/utils/safe-run.ts
*/
import { ExitCodes } from "./exit-codes.js";
import { logger } from "./logger.js";

export interface CommandResult<TData = unknown> {
  success: boolean;
  exitCode: number;
  warnings: string[];
  data?: TData;
  error?: unknown;
}

type AppErrorLike = Error & {
  name: "AppError";
  details?: unknown;
};

export function safeRun<TArgs extends unknown[], TData>(
  fn: (...args: TArgs) => Promise<CommandResult<TData>>,
) {
  return async (...args: TArgs): Promise<CommandResult<TData>> => {
    try {
      return await fn(...args);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AppError") {
        const appError = err as AppErrorLike;

        logger.error(appError.message);

        if (appError.details !== undefined) {
          logger.debug("Details:", appError.details);
        }

        return {
          success: false,
          exitCode: ExitCodes.USER_ERROR.code,
          warnings: [],
          error: err,
        };
      }

      const message = err instanceof Error ? err.message : err;

      logger.error("An internal error happened", message);
      logger.debug(err);

      return {
        success: false,
        exitCode: ExitCodes.INTERNAL_ERROR.code,
        warnings: [],
        error: err,
      };
    }
  };
}
