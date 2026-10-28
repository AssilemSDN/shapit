/**
 * Matches placeholders embedded in a string.
 * - Valid: "Hello {{ user.name }}"
 * - Invalid: "Hello {{ user..name }}"
 */
const PLACEHOLDER = /{{\s*([a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*)\s*}}/g
/**
 * Matches a standalone placeholder, preserving its value type.
 * - Valid: "{{ user.name }}"
 * - Invalid: "Hello {{ user.name }}"
 */
const EXACT = /^{{\s*([a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*)\s*}}$/

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor'])

type Scalar = string | number | boolean

function isScalar(value: unknown): value is Scalar {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}

/**
 * Resolves a variable from a dot-separated path.
 * @throws {Error} If the path is unknown or forbidden.
 */
function lookup(path: string, variables: unknown): unknown {
  let current = variables
  for (const key of path.split('.')) {
    if (
      FORBIDDEN_KEYS.has(key) ||
      typeof current !== 'object' ||
      current === null ||
      !Object.hasOwn(current, key)
    ) {
      throw new Error(`Unknown variable: ${path}`)
    }
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

/**
 * Recursively interpolates placeholders, preserving scalar types for exact matches.
 * @throws {Error} If a placeholder or its resolved value is invalid.
 */
export function interpolate(value: unknown, variables: Record<string, unknown>): unknown {
  if (typeof value === 'string') {
    const exact = EXACT.exec(value)
    if (exact) {
      const resolved = lookup(exact[1]!, variables)
      if (!isScalar(resolved)) {
        throw new Error(`Invalid interpolation value: ${exact[1]}`)
      }
      return resolved
    }
    const result = value.replace(PLACEHOLDER, (_, path: string) => {
      const resolved = lookup(path, variables)
      if (!isScalar(resolved)) {
        throw new Error(`Cannot embed non-scalar value: ${path}`)
      }
      return String(resolved)
    })
    if (result.includes('{{') || result.includes('}}')) {
      throw new Error(`Invalid interpolation expression: ${value}`)
    }
    return result
  }
  if (Array.isArray(value)) {
    return value.map((item) => interpolate(item, variables))
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, interpolate(item, variables)]),
    )
  }
  return value
}
