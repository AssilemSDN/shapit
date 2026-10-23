import { loadSource, type SourceConfig } from './registry.js'

/**
 * Resolves a source into named contexts for interpolation.
 */
export async function resolveSource(source: SourceConfig, baseDir: string) {
  const alias = source.as ?? 'source'
  const values = await loadSource(source, baseDir)
  return values.map((value) => ({ [alias]: value }))
}
