import { AppError } from '../../errors/AppError.js'
import { logger } from '../../utils/logger.js'
import type { CommandResult } from '../../utils/safe-run.js'

interface RenderCommandResultOptions<TData> {
  commandName: string
  result: CommandResult<TData>
  renderData?: (data: TData) => void
}

export function renderCommandResult<TData>({
  commandName,
  result,
  renderData,
}: RenderCommandResultOptions<TData>): void {
  if (result.data !== undefined && renderData !== undefined) {
    renderData(result.data)
  }
  for (const warning of result.warnings) {
    logger.warn(warning)
  }
  if (!result.success) {
    if (result.error instanceof AppError) {
      logger.error(result.error.message)
    } else {
      logger.error(`${commandName} failed.`)
    }
    if (result.error instanceof AppError && result.error.details !== null) {
      logger.debug('Details:', result.error.details)
    }
    if (result.error !== undefined) {
      logger.debug(`Command error : ${result.error}`)
    }
    return
  }

  logger.success(`${commandName} completed successfully.`)
  logger.debug('Command result: ', result)
}
