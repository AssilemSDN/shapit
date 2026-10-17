interface AuditScenario {
  name: string
  files?: string[]
  config: string
  expected: {
    exitCode: 0 | 1 | 2
    passed?: number
    failed?: number
    errorMessage?: string
    errorCode?: string
    warnings?: string[]
  }
}

export const auditScenarios = [
  {
    name: 'passes a compliant project',
    files: ['README.md', 'package.json'],
    config: `
version: 1
rules:
  - id: readme
    type: structure
    parameters:
      path: README.md
      kind: file
  - id: package
    type: structure
    parameters:
      path: package.json
      kind: file
`,
    expected: {
      exitCode: 0,
      passed: 2,
      failed: 0,
    },
  },
  {
    name: 'fails a non-compliant project',
    files: ['package.json'],
    config: `
version: 1
rules:
  - id: package
    type: structure
    parameters:
      path: package.json
      kind: file
  - id: readme
    type: structure
    parameters:
      path: README.md
      kind: file
`,
    expected: {
      exitCode: 1,
      passed: 1,
      failed: 1,
    },
  },
  {
    name: 'rejects invalid configuration',
    config: `
version: 99
rules:
  - id: readme
    type: structure
    parameters:
      path: README.md
`,
    expected: {
      exitCode: 2,
      errorCode: 'INVALID_CONFIG',
    },
  },
  {
    name: 'rejects invalid rule parameters',
    config: `
version: 1
rules:
  - id: invalid-kind
    type: structure
    parameters:
      path: README.md
      kind: banana
`,
    expected: {
      exitCode: 2,
      errorCode: 'INVALID_RULE_CONFIG',
      errorMessage: 'Invalid rule parameters for "invalid-kind"',
    },
  },
  {
    name: 'handles rule execution errors',
    config: `
version: 1
rules:
  - id: invalid-path
    type: structure
    parameters:
      path: "invalid\\u0000path"
`,
    expected: {
      exitCode: 2,
      errorCode: 'RULE_EXECUTION_ERROR',
      errorMessage: 'Error executing rule "invalid-path"',
    },
  },
] satisfies AuditScenario[]
