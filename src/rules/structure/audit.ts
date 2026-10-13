import type { RuleResult } from '../../core/types.js'
import type { StructureObservedInput } from './types.js'

/**
 * Audits a path rule against its existence and type requirements.
 *
 * For "exist", at least one observed path must exist and match the expected kind.
 *
 * For "not_exist", all observed paths must be absent, regardless of their actual type.
 *
 * @param input - The path rule enriched with file system observations.
 * @returns A RuleResult indicating whether the rule is satisfied.
 */
export const auditStructure = (input: StructureObservedInput): RuleResult => {
  const { path, kind, must, observations } = input

  const existing = observations.filter(({ exists }) => exists)
  const expectedPaths = observations.map(({ path }) => path).join(', ')

  if (must === 'not_exist') {
    if (existing.length > 0) {
      const paths = existing.map(({ path }) => `"${path}"`).join(', ')
      return {
        valid: false,
        message: `Unexpected path${existing.length > 1 ? 's' : ''} found: ${paths}`,
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
  if (existing.length > 0) {
    return {
      valid: false,
      message: `No matching ${kind} found for ${expectedPaths}.\n  Found: ${existing.map(({ path, actualType }) => `${path} (${actualType})`).join(', ')}`,
    }
  }

  const [firstObservation] = observations

  if (observations.length === 1 && firstObservation) {
    return {
      valid: false,
      message: `Path "${firstObservation.path}" not found`,
    }
  }

  return {
    valid: false,
    message: `None of the expected paths found: ${expectedPaths}`,
  }
}
