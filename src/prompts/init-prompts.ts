import { confirm } from '@inquirer/prompts'

/**
 * Confirms the creation of a configuration file.
 */
export async function confirmCreateConfig(configPath: string): Promise<boolean> {
  try {
    return await confirm({
      message: `Create configuration file "${configPath}"?`,
      default: false,
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      return false
    }
    throw error
  }
}
