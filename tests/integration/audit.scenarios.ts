interface AuditScenario {
  name: string
  files?: string[]
  contents?: Record<string, string>
  config: string
  expected: {
    exitCode: 0 | 1 | 2
    passed?: number
    failed?: number
    errorMessage?: string
    errorCode?: string
    warnings?: string[]
    resultIds?: string[]
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
  {
    name: 'creates multiple instances from a JSON source',
    contents: {
      'paths.json': JSON.stringify({
        paths: ['README.md', 'package.json', 'LICENSE'],
      }),
    },
    files: ['README.md', 'package.json', 'LICENSE'],
    config: `
version: 1
rules:
  - id: json-files
    type: structure
    source:
      type: json
      file: paths.json
      select: $.paths[*]
    parameters:
      path: "{{ source }}"
      kind: file
`,
    expected: {
      exitCode: 0,
      passed: 3,
      failed: 0,
      resultIds: ['json-files#0', 'json-files#1', 'json-files#2'],
    },
  },
  {
    name: 'fails audit when JSON source resolves to no values',
    contents: {
      'paths.json': JSON.stringify({ paths: [] }),
    },
    config: `
version: 1
rules:
  - id: empty-source
    type: structure
    source:
      type: json
      file: paths.json
      select: $.paths[*]
    parameters:
      path: "{{ source }}"
`,
    expected: {
      exitCode: 1,
      passed: 0,
      failed: 1,
    },
  },
  {
    name: 'rejects a missing JSON source file',
    config: `
version: 1
rules:
  - id: missing-source
    type: structure
    source:
      type: json
      file: missing.json
      select: $.entry
    parameters:
      path: "{{ source }}"
`,
    expected: {
      exitCode: 2,
      errorCode: 'SOURCE_RESOLUTION_ERROR',
    },
  },
  {
    name: 'reuses the same JSON source across rules',
    contents: {
      'paths.json': JSON.stringify({
        paths: ['README.md', 'LICENSE'],
      }),
    },
    files: ['README.md', 'LICENSE'],
    config: `
version: 1
rules:
  - id: json-files-a
    type: structure
    source:
      type: json
      file: paths.json
      select: $.paths[*]
    parameters:
      path: "{{ source }}"
      kind: file
  - id: json-files-b
    type: structure
    source:
      type: json
      file: paths.json
      select: $.paths[*]
    parameters:
      path: "{{ source }}"
      kind: file
`,
    expected: {
      exitCode: 0,
      passed: 4,
      failed: 0,
      resultIds: ['json-files-a#0', 'json-files-a#1', 'json-files-b#0', 'json-files-b#1'],
    },
  },
] satisfies AuditScenario[]
