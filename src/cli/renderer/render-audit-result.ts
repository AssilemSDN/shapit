import type { AuditResult } from '../../core/types.js'
import { logger } from '../../utils/logger.js'

/**
 * Represents the summary of an audit report, including the total number of rules audited, the number of passed and failed rules, and the detailed results of each rule.
 */
export interface AuditReport {
  total: number
  passed: number
  failed: number
  results: AuditResult[]
}

/**
 * Renders the audit results to the console, providing a summary of the audit including the number of passed and failed rules, as well as detailed messages for each rule.
 *
 * @param report - The audit report containing the results of the audit
 */
export function renderAuditResult(report: AuditReport): void {
  for (const result of report.results) {
    if (result.valid) {
      logger.success(`${result.id}: Rule passed`)
      continue
    }
    logger.error(`${result.id}: ${result.message ?? result.description ?? 'Rule failed'}`)
  }
  logger.info(
    `Audit summary: ${report.passed} passed, ${report.failed} failed (${report.total} total).`,
  )
}
