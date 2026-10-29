import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { invalidFileNames, writeErrorScenarios } from './init.scenarios.js'
import { init } from '../../src/core/init.js'
import { ErrorCodes } from '../../src/index.js'
import { confirmCreateConfig } from '../../src/prompts/init-prompts.js'
import { minimalTemplate } from '../../src/templates/minimal.js'

vi.mock('../../src/prompts/init-prompts.js', () => ({
  confirmCreateConfig: vi.fn(),
}))

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>()
  return { ...actual, writeFile: vi.fn(actual.writeFile) }
})

const configFileName = 'shapit.config.yml'

describe('init()', () => {
  let projectDir: string

  beforeEach(async () => {
    projectDir = await mkdtemp(join(tmpdir(), 'shapit-init-'))
    vi.mocked(confirmCreateConfig).mockResolvedValue(true)
  })

  afterEach(async () => {
    vi.clearAllMocks()
    await rm(projectDir, { recursive: true, force: true })
  })

  describe('creation', () => {
    it('creates the minimal configuration after confirmation', async () => {
      const configPath = join(projectDir, configFileName)
      const result = await init(projectDir, configFileName)
      expect(confirmCreateConfig).toHaveBeenCalledExactlyOnceWith(configPath)
      expect(result).toEqual({ status: 'created', configPath })
      expect(await readFile(configPath, 'utf8')).toBe(minimalTemplate)
    })

    it('resolves a relative project directory to an absolute path', async () => {
      const relativeDir = relative(process.cwd(), projectDir)
      const result = await init(relativeDir, configFileName)
      expect(result).toEqual({
        status: 'created',
        configPath: join(resolve(relativeDir), configFileName),
      })
    })

    it('can write into a nested existing directory', async () => {
      const nested = join(projectDir, 'packages', 'core')
      await mkdir(nested, { recursive: true })
      const result = await init(nested, configFileName)
      expect(result.status).toBe('created')
      expect(await readFile(join(nested, configFileName), 'utf8')).toBe(minimalTemplate)
    })
  })

  describe('cancellation', () => {
    it('returns "cancelled" and writes nothing', async () => {
      vi.mocked(confirmCreateConfig).mockResolvedValue(false)
      const result = await init(projectDir, configFileName)
      expect(result).toEqual({
        status: 'cancelled',
        configPath: join(projectDir, configFileName),
      })
      expect(await readdir(projectDir)).toEqual([])
    })
  })

  describe('filename validation', () => {
    it.each(invalidFileNames)('rejects invalid filename "%s"', async (filename) => {
      await expect(init(projectDir, filename)).rejects.toMatchObject({
        code: ErrorCodes.INVALID_CONFIG,
        details: { configFileName: filename },
      })
      expect(confirmCreateConfig).not.toHaveBeenCalled()
      expect(await readdir(projectDir)).toEqual([])
    })
  })

  describe('filesystem errors', () => {
    it('never overwrites an existing configuration file', async () => {
      const configPath = join(projectDir, configFileName)
      await writeFile(configPath, 'existing: true\n')
      await expect(init(projectDir, configFileName)).rejects.toMatchObject({
        code: ErrorCodes.CONFIG_ALREADY_EXISTS,
        details: { path: configPath },
      })
      expect(await readFile(configPath, 'utf8')).toBe('existing: true\n')
    })

    it('fails when the project directory does not exist', async () => {
      const missingDir = join(projectDir, 'missing')
      await expect(init(missingDir, configFileName)).rejects.toMatchObject({
        code: ErrorCodes.PATH_NOT_FOUND,
        details: { path: missingDir },
      })
    })

    it('fails when the project directory is a file', async () => {
      const filePath = join(projectDir, 'not-a-directory')
      await writeFile(filePath, '')
      await expect(init(filePath, configFileName)).rejects.toMatchObject({
        code: ErrorCodes.PATH_NOT_FOUND,
        details: { path: filePath },
      })
    })
  })

  describe('write error mapping', () => {
    it.each(writeErrorScenarios)('$name', async ({ content, expected }) => {
      const cause = Object.assign(new Error('boom'), content.errno ? { code: content.errno } : {})
      vi.mocked(writeFile).mockRejectedValueOnce(cause)
      const configPath = join(projectDir, configFileName)
      await expect(init(projectDir, configFileName)).rejects.toMatchObject({
        code: expected.code,
        details: {
          path: expected.detailsPath === 'directory' ? projectDir : configPath,
        },
        cause,
      })
    })

    it('wraps a non-Error rejection as CONFIG_WRITE_ERROR', async () => {
      vi.mocked(writeFile).mockRejectedValueOnce('string failure')
      await expect(init(projectDir, configFileName)).rejects.toMatchObject({
        code: ErrorCodes.CONFIG_WRITE_ERROR,
        cause: 'string failure',
      })
    })
  })
})
