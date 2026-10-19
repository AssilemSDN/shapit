import { logger } from '../../utils/logger.js'

/**
 * Renders an unexpected error to the console.
 *
 * @param commandName - The name of the command that encountered the error.
 * @param error - The unexpected error that occurred.
 */
export function renderUnexpectedError(commandName: string, error: unknown): void {
  logger.error('An unexpected internal error occurred.')
  logger.debug(`Unexpected error during ${commandName}:`, error)
}
