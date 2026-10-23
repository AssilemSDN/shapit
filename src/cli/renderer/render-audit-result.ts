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
  const groups = new Map<string, AuditResult[]>()

  for (const result of report.results) {
    const group = groups.get(result.ruleId) ?? []
    group.push(result)
    groups.set(result.ruleId, group)
  }

  for (const [ruleId, group] of groups) {
    const isDynamic = group.length > 1 || group[0]?.id !== ruleId
    if (isDynamic) {
      logger.info(`${ruleId} (${group.length} instances)`)
    }

    for (const result of group) {
      const prefix = isDynamic ? '  ' : ''
      if (result.valid) {
        logger.success(`${prefix}${result.id}: Rule passed`)
      } else {
        logger.error(
          `${prefix}${result.id}: ${result.message ?? result.description ?? 'Rule failed'}`,
        )
      }
    }
  }
  logger.info(
    `Audit summary: ${report.passed} passed, ${report.failed} failed (${report.total} total).`,
  )
}
