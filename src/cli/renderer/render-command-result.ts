import { logger } from "../../utils/logger.js";
import type { CommandResult } from "../../utils/safe-run.js";

interface RenderCommandResultOptions<TData> {
  commandName: string;
  result: CommandResult<TData>;
  renderData?: (data: TData) => void;
}

export function renderCommandResult<TData> ({
  commandName,
  result,
  renderData
}: RenderCommandResultOptions<TData>): void {
  if (result.data !== undefined && renderData !== undefined) {
    renderData(result.data)
  }
  for (const warning of result.warnings) {
    logger.warn(warning);
  }
  if (!result.success) {
    logger.error(`${commandName} failed.`)
  }
  if (result.error !== undefined) {
    logger.debug(`Command error : ${result.error}`)
    return;
  }
  logger.success(`${commandName} completed successfully.`)
  logger.debug("Command result: ", result)
}