import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveSource, type SourceCache } from '../../../src/sources/resolve-source.js'
import { jsonSourceLoader } from '../../../src/sources/json/loader.js'
import type { JsonSource } from '../../../src/sources/json/schema.js'

const source: JsonSource = { type: 'json', file: 'file.json', select: '$.items[*]' }
const baseDir = '/project'

describe('resolveSource()', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('reads once when the same file is selected twice', async () => {
    const read = vi.spyOn(jsonSourceLoader, 'read').mockResolvedValue({ items: ['a', 'b'] })
    const cache: SourceCache = new Map()
    expect(await resolveSource(source, baseDir, cache)).toEqual([{ source: 'a' }, { source: 'b' }])
    expect(await resolveSource({ ...source, as: 'entry' }, baseDir, cache)).toEqual([
      { entry: 'a' },
      { entry: 'b' },
    ])
    expect(read).toHaveBeenCalledTimes(1)
  })

  it('retries after a rejected read rather than caching its failure', async () => {
    const read = vi
      .spyOn(jsonSourceLoader, 'read')
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValueOnce({ items: ['ok'] })
    const cache: SourceCache = new Map()
    await expect(resolveSource(source, baseDir, cache)).rejects.toThrow('Temporary failure')
    expect(cache.size).toBe(0)
    expect(await resolveSource(source, baseDir, cache)).toEqual([{ source: 'ok' }])
    expect(read).toHaveBeenCalledTimes(2)
  })
})
