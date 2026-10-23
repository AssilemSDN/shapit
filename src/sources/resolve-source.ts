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
    console.log('load source')
    pending = loader.read(source, baseDir)
    cache.set(key, pending)
  }

  const data = await pending
  return loader.select(data, source).map((values) => ({ [alias]: values }))
}
