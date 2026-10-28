import type { InitResult } from '../../core/init.js'
import { logger } from '../../utils/logger.js'

/**
 * Reports the path of the newly created configuration file.
 */
export function renderInitResult(result: InitResult): void {
  if (result.status === 'cancelled') {
    logger.info('Initialization cancelled.')
    return
  }
  logger.success(`Created configuration file: "${result.configPath}"`)
}
