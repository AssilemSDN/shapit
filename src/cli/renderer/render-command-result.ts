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
    if (result.errors?.length) {
      for (const error of result.errors) {
        logger.error(error.message)

        if (error.details !== undefined) {
          logger.debug('Details:', error.details)
        }

        logger.debug('Error code:', error.code)
      }
    } else {
      logger.error(`${commandName} failed.`)
    }
    return
  }

  logger.success(`${commandName} completed successfully.`)
  logger.debug('Command result: ', result)
}
