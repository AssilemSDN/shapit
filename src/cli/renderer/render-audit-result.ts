import type { AuditResult } from '../../core/types.js'
import { logger } from '../../utils/logger.js'

export interface AuditReport {
  total: number
  passed: number
  failed: number
  results: AuditResult[]
}

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
