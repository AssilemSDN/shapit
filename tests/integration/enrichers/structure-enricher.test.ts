import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { enrichStructureInput } from '../../../src/enrichers/structure-enricher.js'
import { structureEnricherScenarios } from './structure-enricher.scenarios.js'

describe('enrichStructureInput', () => {
  it.each(structureEnricherScenarios)('$name', async ({ filesystem, input, expected }) => {
    const cwd = await mkdtemp(join(tmpdir(), 'shapit-'))

    try {
      // Prepare filesystem
      for (const directory of filesystem?.directories ?? []) {
        await mkdir(join(cwd, directory), { recursive: true })
      }
      for (const file of filesystem?.files ?? []) {
        const filePath = join(cwd, file)
        await mkdir(dirname(filePath), { recursive: true })
        await writeFile(filePath, '')
      }

      // Execute
      const result = await enrichStructureInput(input, { cwd })

      // Assert
      expect(result).toEqual({
        ...input,
        observations: expected.observations,
      })
    } finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
