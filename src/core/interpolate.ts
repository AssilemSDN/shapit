const PLACEHOLDER = /{{\s*([\w.]+)\s*}}/g
const EXACT = /^{{\s*([\w.]+)\s*}}$/

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor'])

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

export function interpolate(value: unknown, variables: Record<string, unknown>): unknown {
  if (typeof value === 'string') {
    const exact = EXACT.exec(value)
    if (exact) {
      return lookup(exact[1]!, variables)
    }
    return value.replace(PLACEHOLDER, (_, path: string) => {
      const resolved = lookup(path, variables)
      if (typeof resolved === 'object') {
        throw new Error(`Cannot embed object: ${path}`)
      }
      return String(resolved)
    })
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
