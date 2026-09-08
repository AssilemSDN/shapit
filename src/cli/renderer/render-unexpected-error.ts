import { logger } from '../../utils/logger.js'

export function renderUnexpectedError(commandName: string, error: unknown): void {
  logger.error('An unexpected internal error occurred.')

  logger.debug(`Unexpected error during ${commandName}:`, error)
}
