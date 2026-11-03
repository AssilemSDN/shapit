import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const cli = fileURLToPath(new URL('../../../bin/shapit.js', import.meta.url))

const validConfig = `
version: 1
rules:
  - id: readme
    type: structure
    parameters:
      path: README.md
      kind: file
`

const scenarios = [
  {
    name: 'successful audit',
    config: validConfig,
    file: true,
    exitCode: 0,
    args: ['audit'],
  },
  {
    name: 'failed audit',
    config: validConfig,
    file: false,
    exitCode: 1,
    args: ['audit'],
  },
  {
    name: 'invalid configuration',
    config: 'rules: [',
    file: false,
    exitCode: 2,
    args: ['audit'],
  },
  {
    name: 'unknown command',
    config: validConfig,
    file: true,
    exitCode: 2,
    args: ['unknown-command'],
  },
  {
    name: 'unknown option on a subcommand',
    config: validConfig,
    file: true,
    exitCode: 2,
    args: ['audit', '--unknown-option'],
  },
]

describe('CLI exit codes', () => {
  it.each(scenarios)('$name', async ({ config, file, exitCode, args }) => {
    const cwd = mkdtempSync(join(tmpdir(), 'shapit-cli-'))
    try {
      await writeFile(join(cwd, 'shapit.yml'), config)
      if (file) {
        await writeFile(join(cwd, 'README.md'), '# README')
      }
      const result = spawnSync(process.execPath, [cli, ...args], {
        cwd,
        encoding: 'utf-8',
      })
      expect(result.status).toBe(exitCode)
    } finally {
      rmSync(cwd, { recursive: true, force: true })
    }
  })
})
