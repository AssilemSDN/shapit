import { jsonSourceSchema } from './json/schema.js'
import { jsonSourceLoader } from './json/loader.js'
import z from 'zod'
import type { SourceLoader } from './types.js'

// sources/registry.ts
export const sourceConfigSchema = z.discriminatedUnion('type', [jsonSourceSchema])
export type SourceConfig = z.infer<typeof sourceConfigSchema>

/**
 * Maps each source type to its corresponding loader.
 *
 * Example: { json: SourceLoader<JsonSourceConfig>, ... }
 */
const loaders: {
  [T in SourceConfig['type']]: SourceLoader<Extract<SourceConfig, { type: T }>>
} = { json: jsonSourceLoader }

export function loadSource(source: SourceConfig, baseDir: string) {
  const loader = loaders[source.type] as SourceLoader<SourceConfig>
  return loader.load(source, baseDir)
}
