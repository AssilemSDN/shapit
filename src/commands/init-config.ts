import { safeRun } from '../utils/safe-run.js'
import { minimalTemplate } from '../templates/minimal.js'
import { init } from '../core/init.js'
import { ExitCodes } from '../utils/exit-codes.js'

export interface InitProjectOptions {
  projectDir: string
  configFileName?: string
}

const DEFAULT_CONFIG = minimalTemplate

/**
 * Creates a starter Shapit configuration without overwriting existing files.
 */
export const initProject = safeRun(
  async ({ projectDir, configFileName = 'shapit.yml' }: InitProjectOptions) => {
    const data = await init(projectDir, configFileName)

    return {
      success: true,
      exitCode: ExitCodes.SUCCESS.code,
      warnings: [],
      data,
    }
  },
)
