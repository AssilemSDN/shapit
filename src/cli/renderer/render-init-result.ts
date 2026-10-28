import { logger } from '../../utils/logger.js'

/** Reports the path of the newly created configuration file. */
export function renderInitResult({ configPath }: { configPath: string }): void {
  logger.info(`Created configuration file: ${configPath}`)
}
