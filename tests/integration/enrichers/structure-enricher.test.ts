import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { AppError } from '../../../src/errors/app-error.js'
import { enrichStructureInput } from '../../../src/enrichers/structure-enricher.js'
import {
  structureEnricherErrorScenarios,
  structureEnricherScenarios,
  structureEnricherSymlinkScenarios,
  type FilesystemFixture,
} from './structure-enricher.scenarios.js'

const withFixture = async (
  filesystem: FilesystemFixture | undefined,
  run: (cwd: string) => Promise<void>,
) => {
  const root = await mkdtemp(join(tmpdir(), 'shapit-'))
  const cwd = join(root, 'project')
  const outside = join(root, 'outside')

  try {
    await mkdir(cwd)
    await mkdir(outside)
    // Prepare filesystem
    for (const directory of filesystem?.directories ?? []) {
      await mkdir(join(cwd, directory), { recursive: true })
    }
    for (const file of filesystem?.files ?? []) {
      const filePath = join(cwd, file)
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, '')
    }
    for (const { path, target, targetRoot = 'project' } of filesystem?.symlinks ?? []) {
      const base = targetRoot === 'outside' ? outside : cwd
      await symlink(join(base, target), join(cwd, path))
    }

    await run(cwd)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

describe('enrichStructureInput', () => {
  it.each(structureEnricherScenarios)('$name', async ({ filesystem, input, expected }) => {
    await withFixture(filesystem, async (cwd) => {
      const result = await enrichStructureInput(input, { cwd })
      expect(result).toEqual({ ...input, observations: expected.observations })
    })
  })
  describe('symlinks', () => {
    it.each(structureEnricherSymlinkScenarios)('$name', async ({ filesystem, input, expected }) => {
      await withFixture(filesystem, async (cwd) => {
        const result = await enrichStructureInput(input, { cwd })
        expect(result).toEqual({ ...input, observations: expected.observations })
      })
    })
  })
  describe('errors', () => {
    it.each(structureEnricherErrorScenarios)(
      '$name',
      async ({ filesystem, input, expectedError }) => {
        await withFixture(filesystem, async (cwd) => {
          const promise = enrichStructureInput(input, { cwd })
          await expect(promise).rejects.toBeInstanceOf(AppError)
          await expect(promise).rejects.toMatchObject({ code: expectedError.code })
        })
      },
    )
  })
})
