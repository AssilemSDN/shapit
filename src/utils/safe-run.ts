/*
  PATH /src/utils/safe-run.ts
*/
import { ExitCodes } from "./exit-codes.js";
import { logger } from "./logger.js";

export interface CommandResult<TData = unknown> {
  success: boolean;
  warnings: string[];
  data?: TData;
  error?: unknown;
}

type AppErrorLike = Error & {
  name: "AppError";
  details?: unknown;
};

/**
 * Wraps an async function and ensures a consistent command result.
 */
export function safeRun<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
) {
  return async (...args: TArgs): Promise<CommandResult> => {
    try {
      const result = await fn(...args);

      if (result !== null && typeof result === "object" && !Array.isArray(result)) {
        const {
          warning,
          warnings = [],
          ...data
        } = result as Record<string, unknown> & {
          warning?: unknown;
          warnings?: unknown;
        };

        const normalizedWarnings = [
          ...(typeof warning === "string" ? [warning] : []),

          ...(Array.isArray(warnings)
            ? warnings.filter((warning): warning is string => typeof warning === "string")
            : typeof warnings === "string"
              ? [warnings]
              : []),
        ];

        return {
          success: true,
          warnings: normalizedWarnings,
          data,
        };
      }

      return {
        success: true,
        warnings: [],
        data: result,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AppError") {
        const appError = err as AppErrorLike;

        logger.error(appError.message);

        if (appError.details !== undefined) {
          logger.debug("Details:", appError.details);
        }

        process.exitCode = ExitCodes.USER_ERROR.code;
      } else {
        const message = err instanceof Error ? err.message : err;

        logger.error("An internal error happened", message);

        logger.debug(err);

        process.exitCode = ExitCodes.INTERNAL_ERROR.code;
      }

      return {
        success: false,
        warnings: [],
        error: err,
      };
    }
  };
}
