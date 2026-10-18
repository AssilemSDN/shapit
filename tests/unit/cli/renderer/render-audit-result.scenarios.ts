import type { AuditReport } from '../../../../src/cli/renderer/render-audit-result.js'

interface RenderAuditResultScenario {
  name: string
  input: AuditReport
  expectedOutput: {
    success: string[]
    error: string[]
    summary: string
  }
}

export const renderAuditResultScenarios = [
  {
    name: 'renders successful audit result',
    input: {
      total: 1,
      passed: 1,
      failed: 0,
      results: [
        {
          id: 'readme',
          type: 'structure',
          valid: true,
        },
      ],
    },
    expectedOutput: {
      success: ['readme: Rule passed'],
      error: [],
      summary: 'Audit summary: 1 passed, 0 failed (1 total).',
    },
  },
  {
    name: 'renders failed audit result',
    input: {
      total: 1,
      passed: 0,
      failed: 1,
      results: [
        {
          id: 'readme',
          type: 'structure',
          valid: false,
        },
      ],
    },
    expectedOutput: {
      success: [],
      error: ['readme: Rule failed'],
      summary: 'Audit summary: 0 passed, 1 failed (1 total).',
    },
  },
] satisfies RenderAuditResultScenario[]
