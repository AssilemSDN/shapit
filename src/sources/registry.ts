import { z } from 'zod'
import { jsonSourceSchema } from './json/schema.js'
import { jsonSourceLoader } from './json/loader.js'
import type { SourceLoader } from './types.js'

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

export function getLoader(source: SourceConfig) {
  return loaders[source.type] as SourceLoader<SourceConfig>
}
