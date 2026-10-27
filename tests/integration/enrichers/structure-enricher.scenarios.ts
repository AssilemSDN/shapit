import type { PathObservation, StructureInput } from '../../../src/rules/structure/types.js'

interface StructureEnricherScenario {
  name: string
  filesystem?: {
    files?: string[]
    directories?: string[]
  }
  input: StructureInput
  expected: {
    observations: PathObservation[]
  }
}

export const structureEnricherScenarios = [
  // OK cases
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
