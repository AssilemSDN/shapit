import { resolve } from "node:path";

import { loadConfig } from "../config/load-config.js";
import { audit } from "../core/audit.js";
import { logger } from "../utils/logger.js";
import { safeRun } from "../utils/safe-run.js";

export interface AuditProjectOptions {
  projectDir: string;
  configFile: string;
}

export const auditProject = safeRun(async ({ projectDir, configFile }: AuditProjectOptions) => {
  const cwd = resolve(projectDir);
  const configPath = resolve(cwd, configFile);

  logger.debug("Project directory:", cwd);
  logger.debug("Configuration file:", configPath);

  const config = await loadConfig(configPath);

  const results = await audit(config, { cwd });

  for (const result of results) {
    if (result.valid) {
      logger.info(`✓ ${result.id}`);
      continue;
    }

    logger.error(`✗ ${result.id}: ${result.message ?? "Rule failed"}`);
  }

  const failed = results.filter((result) => !result.valid);

  return {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
  };
});
