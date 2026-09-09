import { resolve } from 'node:path'

import { loadConfig } from '../config/load-config.js'
import { audit } from '../core/audit.js'
import { ExitCodes } from '../utils/exit-codes.js'
import { logger } from '../utils/logger.js'
import { safeRun } from '../utils/safe-run.js'

export interface AuditProjectOptions {
  projectDir: string
  configFile: string
}

export const auditProject = safeRun(async ({ projectDir, configFile }: AuditProjectOptions) => {
  const cwd = resolve(projectDir)
  const configPath = resolve(cwd, configFile)

  logger.debug('Project directory:', cwd)
  logger.debug('Configuration file:', configPath)

  const config = await loadConfig(configPath)
  const results = await audit(config, { cwd })
  const failed = results.filter((result) => !result.valid)
  const success = failed.length === 0

  return {
    success,
    exitCode: success ? ExitCodes.SUCCESS.code : ExitCodes.AUDIT_FAILED.code,
    warnings: [],
    data: {
      total: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      results,
    },
  }
})
