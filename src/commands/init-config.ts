import { safeRun } from '../utils/safe-run.js'
import { init } from '../core/init.js'
import { ExitCodes } from '../utils/exit-codes.js'

export interface InitConfigOptions {
  projectDir: string
  configFileName?: string
}

/**
 * Creates a starter Shapit configuration without overwriting existing files.
 */
export const initConfig = safeRun(
  async ({ projectDir, configFileName = 'shapit.yml' }: InitConfigOptions) => {
    const data = await init(projectDir, configFileName)

    return {
      success: true,
      exitCode: ExitCodes.SUCCESS.code,
      warnings: [],
      data,
    }
  },
)
