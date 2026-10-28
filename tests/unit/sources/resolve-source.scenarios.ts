import type { JsonSource } from '../../../src/sources/json/schema.js'

interface ResolveSourceScenario {
  name: string
  content: {
    source: JsonSource
    fileContent: string
    cachedData?: unknown
  }
  expected: {
    contexts: Record<string, unknown>[]
    readCalls: number
  }
}

const source = {
  type: 'json' as const,
  file: 'file.json',
  select: '$.name',
}

export const resolveSourceScenarios = [
  {
    name: 'should use the cache instead of reading',
    content: {
      source,
      fileContent: `
      {
        "name": "name-value"
      }
      `,
      cachedData: {
        name: 'name-value',
      },
    },
    expected: {
      contexts: [
        {
          source: 'name-value',
        },
      ],
      readCalls: 0,
    },
  },
  {
    name: 'should read and resolve an uncached source',
    content: {
      source,
      fileContent: JSON.stringify({ name: 'name-value' }),
    },
    expected: {
      contexts: [{ source: 'name-value' }],
      readCalls: 1,
    },
  },
  {
    name: 'should resolve multiple selected values',
    content: {
      source: { ...source, select: '$.names[*]' },
      fileContent: JSON.stringify({
        names: ['first', 'second'],
      }),
    },
    expected: {
      contexts: [{ source: 'first' }, { source: 'second' }],
      readCalls: 1,
    },
  },
  {
    name: 'should use a custom alias',
    content: {
      source: { ...source, as: 'package' },
      fileContent: JSON.stringify({ name: 'core' }),
    },
    expected: {
      contexts: [{ package: 'core' }],
      readCalls: 1,
    },
  },
  {
    name: 'should preserve selected object values',
    content: {
      source: { ...source, select: '$.packages[*]', as: 'package' },
      fileContent: JSON.stringify({
        packages: [
          { name: 'core', path: 'packages/core' },
          { name: 'cli', path: 'packages/cli' },
        ],
      }),
    },
    expected: {
      contexts: [
        { package: { name: 'core', path: 'packages/core' } },
        { package: { name: 'cli', path: 'packages/cli' } },
      ],
      readCalls: 1,
    },
  },
  {
    name: 'should return no contexts when selection is empty',
    content: {
      source: { ...source, select: '$.missing' },
      fileContent: JSON.stringify({ name: 'value' }),
    },
    expected: {
      contexts: [],
      readCalls: 1,
    },
  },
  {
    name: 'should preserve null values',
    content: {
      source,
      fileContent: JSON.stringify({ name: null }),
    },
    expected: {
      contexts: [{ source: null }],
      readCalls: 1,
    },
  },
] satisfies ResolveSourceScenario[]
