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
]
