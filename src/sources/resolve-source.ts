import { getLoader, type SourceConfig } from './registry.js'

export type SourceCache = Map<string, Promise<unknown>>

/**
 * Resolves a source into named contexts for interpolation.
 */
export async function resolveSource(
  source: SourceConfig,
  baseDir: string,
  cache: SourceCache = new Map(),
) {
  const alias = source.as ?? 'source'
  const loader = getLoader(source)
  const key = loader.key(source, baseDir)

  let pending = cache.get(key)
  if (!pending) {
    pending = loader.read(source, baseDir)
    cache.set(key, pending)
  }
  let data: unknown
  try {
    data = await pending
  } catch (error) {
    // A failed read must not be in the cache
    if (cache.get(key) === pending) cache.delete(key)
    throw error
  }
  return loader.select(data, source).map((values) => ({ [alias]: values }))
}
