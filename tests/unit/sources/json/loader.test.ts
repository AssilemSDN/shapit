import path from 'node:path'
import { readFile, realpath } from 'node:fs/promises'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { invalidReadScenarios, readScenarios } from './loader.scenarios.js'
import { jsonSourceLoader } from '../../../../src/sources/json/loader.js'
import { ErrorCodes } from '../../../../src/errors/error-codes.js'

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  realpath: vi.fn(),
}))

const source = {
  type: 'json' as const,
  file: 'file.json',
  select: '$.name',
}

const baseDir = path.resolve('project')

describe('JSON source loader - read()', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(realpath).mockImplementation(async (path) => String(path))
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

  it('should reject a symbolic link escaping the project', async () => {
    vi.mocked(realpath).mockImplementation(async (target) => {
      const resolvedPath = String(target)
      if (resolvedPath.endsWith('file.json')) {
        return path.resolve(baseDir, '..', 'outside', 'file.json')
      }
      return resolvedPath
    })
    await expect(jsonSourceLoader.read(source, baseDir)).rejects.toMatchObject({
      code: ErrorCodes.PATH_OUTSIDE_BASE_DIRECTORY,
    })
    expect(readFile).not.toHaveBeenCalled()
  })

  it('should read a symbolic link inside the project', async () => {
    vi.mocked(realpath).mockImplementation(async (target) => {
      const resolvedPath = String(target)
      if (resolvedPath.endsWith('file.json')) {
        return path.join(baseDir, 'internal.json')
      }
      return resolvedPath
    })
    vi.mocked(readFile).mockResolvedValue('{"ok":true}')
    await expect(jsonSourceLoader.read(source, baseDir)).resolves.toEqual({
      ok: true,
    })
    expect(readFile).toHaveBeenCalledWith(path.join(baseDir, 'internal.json'), 'utf-8')
  })
})
