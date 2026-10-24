import { describe, expect, it } from 'vitest'
import { interpolateScenarios, invalidInterpolateScenarios } from './interpolate.scenarios.js'
import { interpolate } from '../../../src/core/interpolate.js'

describe('interpolate()', () => {
  it.each(interpolateScenarios)('$name', ({ content, expected }) => {
    expect(interpolate(content.value, content.variables)).toEqual(expected)
  })

  it.each(invalidInterpolateScenarios)('$name', ({ content, expected }) => {
    expect(() => interpolate(content.value, content.variables)).toThrow(expected)
  })
})
