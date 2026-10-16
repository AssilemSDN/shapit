import { describe, expect, it } from 'vitest'

import { auditStructure } from '../../../../src/rules/structure/audit.js'
import { auditStructureScenarios } from './audit.scenarios.js'

describe('auditStructure', () => {
  it.each(auditStructureScenarios)('$name', ({ input, expected }) => {
    const result = auditStructure(input)

    expect(result.valid).toBe(expected.valid)

    if (expected.message !== undefined) {
      expect(result.message).toBe(expected.message)
    }
  })
})
