import { beforeEach, describe, expect, it, vi } from 'vitest'
import { invalidReadScenarios, readScenarios } from './loader.scenarios.js'
import { readFile } from 'node:fs/promises'
import { jsonSourceLoader } from '../../../../src/sources/json/loader.js'
import { ErrorCodes } from '../../../../src/index.js'

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
    vi.resetAllMocks()
  })

  it.each(readScenarios)('$name', async ({ content, expected }) => {
    vi.mocked(readFile).mockResolvedValue(content)
    const result = await jsonSourceLoader.read(source, baseDir)
    expect(result).toEqual(expected)
  })

  it.each(invalidReadScenarios)('$name', async ({ content }) => {
    vi.mocked(readFile).mockResolvedValue(content)
    await expect(jsonSourceLoader.read(source, baseDir)).rejects.toMatchObject({
      name: 'AppError',
      code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
    })
  })

  it('should wrap a missing source file', async () => {
    const error = Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
    vi.mocked(readFile).mockRejectedValue(error)
    await expect(jsonSourceLoader.read(source, baseDir)).rejects.toMatchObject({
      code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
      cause: error,
    })
  })

  it('should wrap permission errors', async () => {
    const error = Object.assign(new Error('EACCES'), { code: 'EACCES' })
    vi.mocked(readFile).mockRejectedValue(error)
    await expect(jsonSourceLoader.read(source, baseDir)).rejects.toMatchObject({
      code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
      cause: error,
    })
  })
})
