import type { StructureObservedInput } from '../../../../src/rules/structure/types.js'

interface AuditStructureScenario {
  name: string
  input: StructureObservedInput
  expected: {
    valid: boolean
    message: string
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
      observations: [{ path: 'README.md', exists: true, actualType: 'file' }],
    },
    expected: {
      valid: true,
      message: 'Matching file found: "README.md"',
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
      message: 'Expected paths are absent: terraform',
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
      message: 'Matching file found: "README.txt"',
    },
  },
  {
    name: 'passes with kind any when a path of any type exists',
    input: {
      path: 'LICENSE',
      kind: 'any',
      must: 'exist',
      observations: [{ path: 'LICENSE', exists: true, actualType: 'other' }],
    },
    expected: {
      valid: true,
      message: 'Matching path found: "LICENSE"',
    },
  },
  {
    name: 'lists every matching alternative',
    input: {
      path: 'config.{json,yml}',
      kind: 'file',
      must: 'exist',
      observations: [
        { path: 'config.json', exists: true, actualType: 'file' },
        { path: 'config.yml', exists: true, actualType: 'file' },
      ],
    },
    expected: {
      valid: true,
      message: 'Matching file found: "config.json", "config.yml"',
    },
  },
  {
    name: 'passes not_exist with several absent alternatives',
    input: {
      path: 'config.{json,yaml}',
      kind: 'any',
      must: 'not_exist',
      observations: [
        { path: 'config.json', exists: false },
        { path: 'config.yaml', exists: false },
      ],
    },
    expected: {
      valid: true,
      message: 'Expected paths are absent: config.json, config.yaml',
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
      message: 'Unexpected path found: "terraform"',
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
  {
    name: 'fails not_exist when only one of several alternatives exists',
    input: {
      path: 'config.{json,yaml}',
      kind: 'any',
      must: 'not_exist',
      observations: [
        { path: 'config.json', exists: false },
        { path: 'config.yaml', exists: true, actualType: 'directory' },
      ],
    },
    expected: {
      valid: false,
      message: 'Unexpected path found: "config.yaml"',
    },
  },
  {
    name: 'fails when alternatives are a mix of wrong type and missing',
    input: {
      path: 'README.{md,txt}',
      kind: 'file',
      must: 'exist',
      observations: [
        { path: 'README.md', exists: true, actualType: 'directory' },
        { path: 'README.txt', exists: false },
      ],
    },
    expected: {
      valid: false,
      message: 'No matching file found for README.md, README.txt.\n  Found: README.md (directory)',
    },
  },
  {
    name: 'fails when a symlink is observed but a file is required',
    input: {
      path: 'link.txt',
      kind: 'file',
      must: 'exist',
      observations: [{ path: 'link.txt', exists: true, actualType: 'symlink' }],
    },
    expected: {
      valid: false,
      message: 'No matching file found for link.txt.\n  Found: link.txt (symlink)',
    },
  },
] satisfies AuditStructureScenario[]
