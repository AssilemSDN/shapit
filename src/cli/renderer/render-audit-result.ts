import type { AuditResult } from "../../core/types.js";
import { logger } from "../../utils/logger.js";

export function renderAuditResult(results: AuditResult[]): void {
  for (const result of results) {
    if (result.valid) {
      logger.success(`${result.id}: Rule passed`);
      continue;
    }
    logger.error(
      `${result.id}: ${result.message ?? result.description ?? "Rule failed"}`,
    );
  }
}