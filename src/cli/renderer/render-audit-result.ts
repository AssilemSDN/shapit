import type { AuditResult } from '../../core/types.js'
import { logger } from '../../utils/logger.js'

/**
 * Represents the summary of an audit report, including the total number
 * of audited instances, passed and failed instances, and their results.
 */
export interface AuditReport {
  total: number
  passed: number
  failed: number
  results: AuditResult[]
}

/**
 * Renders audit results to the console, grouping dynamic rule instances.
 *
 * @param report - The audit report containing the results.
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
      const label = group.length === 1 ? 'instance' : 'instances'
      logger.info(`${ruleId} (${group.length} ${label})`)
    }

    for (const result of group) {
      const id = isDynamic ? result.id.slice(ruleId.length) : result.id
      const message =
        result.message ?? result.description ?? (result.valid ? 'Rule passed' : 'Rule failed')
      const options = { indent: isDynamic ? 2 : 0 }

      if (result.valid) {
        logger.success(`${id}: ${message}`, options)
      } else {
        logger.error(`${id}: ${message}`, options)
      }
    }
  }

  logger.info(
    `Audit summary: ${report.passed} passed, ${report.failed} failed (${report.total} total).`,
  )
}
