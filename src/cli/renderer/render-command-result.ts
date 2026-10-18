import { logger } from '../../utils/logger.js'
import type { CommandResult } from '../../utils/safe-run.js'
import { formatErrorDetails } from './error-details-formatter.js'

interface RenderCommandResultOptions<TData> {
  commandName: string
  result: CommandResult<TData>
  renderData?: (data: TData) => void
}

/**
 * Renders the result of a command execution to the console.
 *
 * @param options - The options for rendering the command result.
 */
export function renderCommandResult<TData>({
  commandName,
  result,
  renderData,
}: RenderCommandResultOptions<TData>): void {
  for (const warning of result.warnings) {
    logger.warn(warning)
  }

  if (result.data !== undefined && renderData !== undefined) {
    renderData(result.data)
  }

  logger.debug('Command result: ', result)

  if (!result.success) {
    if (result.errors?.length) {
      for (const error of result.errors) {
        logger.error(error.message)
        for (const message of formatErrorDetails(error.details)) {
          logger.error(` - ${message}`)
        }

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
}
