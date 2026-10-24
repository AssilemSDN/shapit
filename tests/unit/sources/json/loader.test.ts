import { beforeEach, describe, expect, it, vi } from 'vitest'
import { invalidReadScenarios, readScenarios } from './loader.scenarios.js'
import { readFile } from 'node:fs/promises'
import { jsonSourceLoader } from '../../../../src/sources/json/loader.js'

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}))

const source = {
  type: 'json' as const,
  file: 'file.json',
  select: '$.name',
}

const baseDir = '/project'

describe('JSON source loader - read()', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it.each(readScenarios)('$name', async ({ content, expected }) => {
    vi.mocked(readFile).mockResolvedValue(content)
    const result = await jsonSourceLoader.read(source, baseDir)
    expect(result).toEqual(expected)
  })

  it.each(invalidReadScenarios)('$name', async ({ content }) => {
    vi.mocked(readFile).mockResolvedValue(content)
    await expect(jsonSourceLoader.read(source, baseDir)).rejects.toThrow(SyntaxError)
  })

  it('should propagate filesystem errors', async () => {
    const error = new Error('ENOENT')
    vi.mocked(readFile).mockRejectedValue(error)
    await expect(jsonSourceLoader.read(source, baseDir)).rejects.toBe(error)
  })
})
