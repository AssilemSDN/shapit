interface ReadScenario {
  name: string
  content: string
  expected?: unknown
}

export const readScenarios = [
  {
    name: 'should parse a JSON object',
    content: `
    {
      "name": "shapit",
      "version": "0.2.0"
    }
    `,
    expected: {
      name: 'shapit',
      version: '0.2.0',
    },
  },
] satisfies ReadScenario[]

export const invalidReadScenarios = [
  {
    name: 'should reject malformed JSON',
    content: `
    { "name": }
    `,
  },
  {
    name: 'should reject empty JSON',
    content: '',
  },
] satisfies ReadScenario[]
