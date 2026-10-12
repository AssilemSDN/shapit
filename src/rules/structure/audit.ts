import type { RuleResult } from '../../core/types.js'
import type { StructureObservedInput } from './types.js'

/**
 * Audits a path rule against its existence and type requirements.
 *
 * For "exist", at least one observed path must exist and matchthe expected kind.
 *
 * For "not_exist", all observed paths must be absent, regardless of their actual type.
 *
 * @param input - The path rule enriched with file system observations.
 * @returns A RuleResult indicating whether the rule is satisfied.
 */
export const auditStructure = (input: StructureObservedInput): RuleResult => {
  const { path, kind, must, observations } = input

  if (must === 'not_exist') {
    const existing = observations.filter(({ exists }) => exists)

    if (existing.length > 0) {
      return {
        valid: false,
        message: `Path "${path}" must not exist. Found: ${existing.map(({ path }) => path).join(', ')}`,
      }
    }

    return { valid: true }
  }

  const matching = observations.filter(
    ({ exists, actualType }) => exists && (kind === 'any' || actualType === kind),
  )

  if (matching.length > 0) {
    return { valid: true }
  }

  const existing = observations.filter(({ exists }) => exists)

  if (existing.length > 0) {
    return {
      valid: false,
      message: `Path "${path}" must be a ${kind}. Found incompatible types: ${existing.map(({ path, actualType }) => `${path} (${actualType})`).join(', ')}`,
    }
  }

  return {
    valid: false,
    message: `Required path "${path}" does not exist`,
  }
}
