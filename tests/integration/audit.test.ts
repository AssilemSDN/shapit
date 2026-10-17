import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { auditProject } from '../../src/commands/audit-project.js'
import { auditScenarios } from './audit.scenarios.js'

describe('auditProject integration', () => {
  it.each(auditScenarios)('$name', async ({ files, config, expected }) => {
    const cwd = await mkdtemp(join(tmpdir(), 'shapit-'))

    try {
      // Prepare project
      for (const file of files ?? []) {
        await writeFile(join(cwd, file), '')
      }

      await writeFile(join(cwd, 'shapit.yml'), config)

      // Execute
      const result = await auditProject({
        projectDir: cwd,
        configFile: 'shapit.yml',
      })

      // Assert exit code
      expect(result.exitCode).toBe(expected.exitCode)
      expect(result.success).toBe(expected.exitCode === 0)

      if (expected.exitCode === 2) {
        // Application error
        expect(result.data).toBeUndefined()
        expect(result.errors).toHaveLength(1)
        expect(result.errors?.[0]?.code).toBe(expected.errorCode)
        if (expected.errorMessage) {
          expect(result.errors?.[0]?.message).toBe(expected.errorMessage)
        }
      } else {
        // Business audit result
        expect(result.errors ?? []).toEqual([])
        expect(result.data).toMatchObject({
          total: expected.passed! + expected.failed!,
          passed: expected.passed,
          failed: expected.failed,
        })
        expect(result.data?.results).toHaveLength(expected.passed! + expected.failed!)
      }
      expect(result.warnings).toEqual('warnings' in expected ? expected.warnings : [])
    } finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
