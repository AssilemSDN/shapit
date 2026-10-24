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
] satisfies ResolveSourceScenario[]
