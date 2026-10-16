import type { StructureObservedInput } from '../../../../src/rules/structure/types.js'

interface AuditStructureScenario {
  name: string
  input: StructureObservedInput
  expected: {
    valid: boolean
    message?: string
  }
}

export const auditStructureScenarios = [
  // OK cases
  {
    name: 'passes when required file exists',
    input: {
      path: 'README.md',
      kind: 'file',
      must: 'exist',
      observations: [
        {
          path: 'README.md',
          exists: true,
          actualType: 'file',
        },
      ],
    },
    expected: {
      valid: true,
    },
  },
  {
    name: 'passes when forbidden directory is absent',
    input: {
      path: 'terraform',
      kind: 'directory',
      must: 'not_exist',
      observations: [{ path: 'terraform', exists: false }],
    },
    expected: {
      valid: true,
    },
  },
  {
    name: 'passes when one alternative matches',
    input: {
      path: 'README.{md,txt}',
      kind: 'file',
      must: 'exist',
      observations: [
        // First alternative : bad type
        {
          path: 'README.md',
          exists: true,
          actualType: 'directory',
        },
        // Second alternative : OK
        {
          path: 'README.txt',
          exists: true,
          actualType: 'file',
        },
      ],
    },
    expected: {
      valid: true,
    },
  },
  // KO cases
  {
    name: 'fails when required file is missing',
    input: {
      path: 'README.md',
      kind: 'file',
      must: 'exist',
      observations: [
        {
          path: 'README.md',
          exists: false,
        },
      ],
    },
    expected: {
      valid: false,
      message: 'Path "README.md" not found',
    },
  },
  {
    name: 'fails when forbidden directory exists',
    input: {
      path: 'terraform',
      kind: 'directory',
      must: 'not_exist',
      observations: [{ path: 'terraform', exists: true, actualType: 'directory' }],
    },
    expected: {
      valid: false,
    },
  },
  {
    name: 'fails when path has incompatible type',
    input: {
      path: 'terraform',
      kind: 'directory',
      must: 'exist',
      observations: [
        {
          path: 'terraform',
          exists: true,
          actualType: 'file',
        },
      ],
    },
    expected: {
      valid: false,
      message: 'No matching directory found for terraform.\n  Found: terraform (file)',
    },
  },
  {
    name: 'fails when all alternatives are missing',
    input: {
      path: 'README.{md,txt}',
      kind: 'file',
      must: 'exist',
      observations: [
        { path: 'README.md', exists: false },
        { path: 'README.txt', exists: false },
      ],
    },
    expected: {
      valid: false,
      message: 'None of the expected paths found: README.md, README.txt',
    },
  },
  {
    name: 'fails when multiple forbidden paths exist',
    input: {
      path: 'config.{json,yaml}',
      kind: 'any',
      must: 'not_exist',
      observations: [
        { path: 'config.json', exists: true, actualType: 'file' },
        { path: 'config.yaml', exists: true, actualType: 'file' },
      ],
    },
    expected: {
      valid: false,
      message: 'Unexpected paths found: "config.json", "config.yaml"',
    },
  },
] satisfies AuditStructureScenario[]
