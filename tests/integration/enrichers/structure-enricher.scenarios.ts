import type { PathObservation, StructureInput } from '../../../src/rules/structure/types.js'
import { ErrorCodes } from '../../../src/errors/error-codes.js'

export interface FilesystemFixture {
  files?: string[]
  directories?: string[]
  symlinks?: {
    path: string
    target: string
    targetRoot?: 'project' | 'outside' // default: 'project'
  }[]
}

interface BaseScenario {
  name: string
  filesystem?: FilesystemFixture
  input: StructureInput
}

interface StructureEnricherScenario extends BaseScenario {
  expected: {
    observations: PathObservation[]
  }
}

interface StructureEnricherErrorScenario extends BaseScenario {
  expectedError: {
    code: (typeof ErrorCodes)[keyof typeof ErrorCodes]
  }
}

export const structureEnricherScenarios = [
  {
    name: 'observes existing file',
    filesystem: {
      files: ['README.md'],
    },
    input: {
      path: 'README.md',
      kind: 'file',
      must: 'exist',
    },
    expected: {
      observations: [
        {
          path: 'README.md',
          exists: true,
          actualType: 'file',
        },
      ],
    },
  },
  {
    name: 'observes existing directory',
    filesystem: {
      directories: ['src'],
    },
    input: {
      path: 'src',
      kind: 'directory',
      must: 'exist',
    },
    expected: {
      observations: [
        {
          path: 'src',
          exists: true,
          actualType: 'directory',
        },
      ],
    },
  },
  {
    name: 'observes missing file',
    input: {
      path: 'README.md',
      kind: 'file',
      must: 'exist',
    },
    expected: {
      observations: [
        {
          path: 'README.md',
          exists: false,
        },
      ],
    },
  },
  {
    name: 'observes nested file',
    filesystem: {
      files: ['src/index.ts'],
    },
    input: {
      path: 'src/index.ts',
      kind: 'file',
      must: 'exist',
    },
    expected: {
      observations: [
        {
          path: 'src/index.ts',
          exists: true,
          actualType: 'file',
        },
      ],
    },
  },
  {
    name: 'observes missing path when parent is a file (must exist)',
    filesystem: {
      files: ['README.md'],
    },
    input: {
      path: 'README.md/child',
      kind: 'file',
      must: 'exist',
    },
    expected: {
      observations: [
        {
          path: 'README.md/child',
          exists: false,
        },
      ],
    },
  },
  {
    name: 'observes missing path when parent is a file (must not exist)',
    filesystem: {
      files: ['README.md'],
    },
    input: {
      path: 'README.md/child',
      kind: 'directory',
      must: 'not_exist',
    },
    expected: {
      observations: [
        {
          path: 'README.md/child',
          exists: false,
        },
      ],
    },
  },

  // Brace expansion
  {
    name: 'expands brace alternatives',
    filesystem: {
      files: ['README.md'],
    },
    input: {
      path: 'README.{md,txt}',
      kind: 'file',
      must: 'exist',
    },
    expected: {
      observations: [
        {
          path: 'README.md',
          exists: true,
          actualType: 'file',
        },
        {
          path: 'README.txt',
          exists: false,
        },
      ],
    },
  },
  {
    name: 'observes multiple existing alternatives',
    filesystem: {
      files: ['config.json'],
      directories: ['config.yaml'],
    },
    input: {
      path: 'config.{json,yaml}',
      kind: 'file',
      must: 'exist',
    },
    expected: {
      observations: [
        {
          path: 'config.json',
          exists: true,
          actualType: 'file',
        },
        {
          path: 'config.yaml',
          exists: true,
          actualType: 'directory',
        },
      ],
    },
  },
  {
    name: 'preserves brace expansion order',
    filesystem: {
      files: ['config.yml', 'config.json'],
    },
    input: {
      path: 'config.{json,yaml,yml}',
      kind: 'file',
      must: 'exist',
    },
    expected: {
      observations: [
        { path: 'config.json', exists: true, actualType: 'file' },
        { path: 'config.yaml', exists: false },
        { path: 'config.yml', exists: true, actualType: 'file' },
      ],
    },
  },
  {
    name: 'deduplicates brace alternatives',
    filesystem: {
      files: ['README.md'],
    },
    input: {
      path: 'README.{md,md,txt}',
      kind: 'file',
      must: 'exist',
    },
    expected: {
      observations: [
        { path: 'README.md', exists: true, actualType: 'file' },
        { path: 'README.txt', exists: false },
      ],
    },
  },
  {
    name: 'observes the project root itself',
    input: { path: '.', kind: 'directory', must: 'exist' },
    expected: { observations: [{ path: '.', exists: true, actualType: 'directory' }] },
  },
  {
    name: 'observes missing path when parent does not exist',
    input: { path: 'missing/child.txt', kind: 'file', must: 'exist' },
    expected: { observations: [{ path: 'missing/child.txt', exists: false }] },
  },
  // Requirement independence
  {
    name: 'observes forbidden path without evaluating requirement',
    filesystem: {
      files: ['.env'],
    },
    input: {
      path: '.env',
      kind: 'any',
      must: 'not_exist',
    },
    expected: {
      observations: [
        {
          path: '.env',
          exists: true,
          actualType: 'file',
        },
      ],
    },
  },
] satisfies StructureEnricherScenario[]

export const structureEnricherSymlinkScenarios = [
  {
    name: 'reports a symlink to a file as symlink (does not follow)',
    filesystem: {
      files: ['real.txt'],
      symlinks: [{ path: 'link.txt', target: 'real.txt' }],
    },
    input: { path: 'link.txt', kind: 'file', must: 'exist' },
    expected: { observations: [{ path: 'link.txt', exists: true, actualType: 'symlink' }] },
  },
  {
    name: 'reports a symlink to a directory as symlink',
    filesystem: {
      directories: ['real-dir'],
      symlinks: [{ path: 'link-dir', target: 'real-dir' }],
    },
    input: { path: 'link-dir', kind: 'directory', must: 'exist' },
    expected: { observations: [{ path: 'link-dir', exists: true, actualType: 'symlink' }] },
  },
  {
    name: 'reports a broken symlink as existing symlink',
    filesystem: {
      symlinks: [{ path: 'broken', target: 'does-not-exist' }],
    },
    input: { path: 'broken', kind: 'file', must: 'exist' },
    expected: { observations: [{ path: 'broken', exists: true, actualType: 'symlink' }] },
  },
  {
    name: 'reports a self-referencing symlink as symlink (final entry is not followed)',
    filesystem: {
      symlinks: [{ path: 'loop', target: 'loop' }],
    },
    input: { path: 'loop', kind: 'any', must: 'exist' },
    expected: { observations: [{ path: 'loop', exists: true, actualType: 'symlink' }] },
  },
  {
    name: 'follows a symlinked parent that stays inside the project',
    filesystem: {
      files: ['real/file.txt'],
      symlinks: [{ path: 'alias', target: 'real' }],
    },
    input: { path: 'alias/file.txt', kind: 'file', must: 'exist' },
    expected: {
      observations: [{ path: 'alias/file.txt', exists: true, actualType: 'file' }],
    },
  },
  {
    name: 'observes brace alternatives mixing file and symlink',
    filesystem: {
      files: ['config.json'],
      symlinks: [{ path: 'config.yaml', target: 'config.json' }],
    },
    input: { path: 'config.{json,yaml}', kind: 'file', must: 'exist' },
    expected: {
      observations: [
        { path: 'config.json', exists: true, actualType: 'file' },
        { path: 'config.yaml', exists: true, actualType: 'symlink' },
      ],
    },
  },
] satisfies StructureEnricherScenario[]

export const structureEnricherErrorScenarios = [
  {
    name: 'rejects a path escaping via ..',
    input: { path: '../outside.txt', kind: 'file', must: 'exist' },
    expectedError: { code: ErrorCodes.PATH_OUTSIDE_BASE_DIRECTORY },
  },
  {
    name: 'rejects a path whose parent is a symlink pointing outside the project',
    filesystem: {
      symlinks: [{ path: 'escape', target: '.', targetRoot: 'outside' }],
    },
    input: { path: 'escape/file.txt', kind: 'file', must: 'exist' },
    expectedError: { code: ErrorCodes.PATH_OUTSIDE_BASE_DIRECTORY },
  },
  {
    name: 'rejects a brace expansion when one alternative escapes',
    input: { path: '{ok.txt,../outside.txt}', kind: 'file', must: 'exist' },
    expectedError: { code: ErrorCodes.PATH_OUTSIDE_BASE_DIRECTORY },
  },
  {
    name: 'rejects a symlink cycle traversed as a parent',
    filesystem: {
      symlinks: [{ path: 'loop', target: 'loop' }],
    },
    input: { path: 'loop/child', kind: 'file', must: 'exist' },
    expectedError: { code: ErrorCodes.RULE_EXECUTION_ERROR },
  },
] satisfies StructureEnricherErrorScenario[]
