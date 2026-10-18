import { describe, afterEach, expect, it, vi } from 'vitest'
import { renderAuditResultScenarios } from './render-audit-result.scenarios.js'
import { logger } from '../../../../src/utils/logger.js'
import { renderAuditResult } from '../../../../src/cli/renderer/render-audit-result.js'

describe('render-audit-result', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(renderAuditResultScenarios)('$name', ({ input, expectedOutput }) => {
    const successLogs = vi.spyOn(logger, 'success').mockImplementation(() => {})
    const errorLogs = vi.spyOn(logger, 'error').mockImplementation(() => {})
    const infoLogs = vi.spyOn(logger, 'info').mockImplementation(() => {})

    renderAuditResult(input)

    expect(successLogs.mock.calls.map(([message]) => message)).toEqual(expectedOutput.success)
    expect(errorLogs.mock.calls.map(([message]) => message)).toEqual(expectedOutput.error)
    expect(infoLogs.mock.calls.map(([message]) => message)).toEqual([expectedOutput.summary])
  })
})
