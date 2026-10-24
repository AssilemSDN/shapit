interface InterpolateScenario {
  name: string
  content: {
    value: unknown
    variables: Record<string, unknown>
  }
  expected: unknown
}

export const interpolateScenarios = [
  {
    name: 'should interpolate a string',
    content: {
      value: '{{ source }}',
      variables: {
        source: 'index.js',
      },
    },
    expected: 'index.js',
  },
  {
    name: 'should interpolate a boolean',
    content: {
      value: '{{ source }}',
      variables: {
        source: true,
      },
    },
    expected: true,
  },
  {
    name: 'should interpolate multiple variables',
    content: {
      value: '{{ dir }}/{{ file }}',
      variables: {
        dir: 'dist',
        file: 'index.js',
      },
    },
    expected: 'dist/index.js',
  },
  {
    name: 'should interpolate nested properties',
    content: {
      value: '{{ package.main }}',
      variables: {
        package: {
          main: 'dist/index.js',
        },
      },
    },
    expected: 'dist/index.js',
  },
] satisfies InterpolateScenario[]

export const invalidInterpolateScenarios = [
  {
    name: 'should reject unknown variables',
    content: {
      value: '{{ missing }}',
      variables: {},
    },
    expected: 'Unknown variable: missing',
  },
  {
    name: 'should reject proto access',
    content: {
      value: '{{ source.__proto__ }}',
      variables: {},
    },
    expected: 'Unknown variable: source.__proto__',
  },
  {
    name: 'should reject object embedding',
    content: {
      value: '{{ file }}.ts',
      variables: {
        file: {
          name: 'index',
        },
      },
    },
    expected: 'Cannot embed object: file',
  },
] satisfies InterpolateScenario[]
