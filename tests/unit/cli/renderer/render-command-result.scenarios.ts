import type { CommandResult } from '../../../../src/utils/safe-run.js'

interface RenderCommandResultScenario {
  name: string
  result: CommandResult<string>
  expected: {
    warn: string[]
    error: string[]
    success: string[]
    data?: string
  }
}

export const renderCommandResultScenarios = [
  {
    name: 'renders a successful command',
    result: {
      success: true,
      exitCode: 0,
      warnings: [],
    },
    expected: {
      warn: [],
      error: [],
      success: ['audit completed successfully.'],
    },
  },
  {
    name: 'renders warnings and data',
    result: {
      success: true,
      exitCode: 0,
      warnings: ['Version missing'],
      data: 'report',
    },
    expected: {
      warn: ['Version missing'],
      error: [],
      success: ['audit completed successfully.'],
      data: 'report',
    },
  },
  {
    name: 'renders errors with details',
    result: {
      success: false,
      exitCode: 2,
      warnings: [],
      errors: [
        {
          message: 'Invalid configuration',
          code: 'INVALID_CONFIG',
          details: [{ message: 'Required', path: ['rules', 0, 'parameters', 'path'] }],
        },
      ],
    },
    expected: {
      warn: [],
      error: ['Invalid configuration', ' - Required (rules.0.parameters.path)'],
      success: [],
    },
  },
  {
    name: 'renders a fallback when errors are missing',
    result: {
      success: false,
      exitCode: 1,
      warnings: [],
    },
    expected: {
      warn: [],
      error: ['audit failed.'],
      success: [],
    },
  },
] satisfies RenderCommandResultScenario[]
