import { confirm } from '@inquirer/prompts'

/**
 * Confirms the creation of a configuration file.
 */
export function confirmCreateConfig(configPath: string): Promise<boolean> {
  return confirm({
    message: `Create configuration file "${configPath}"?`,
    default: false,
  })
}
