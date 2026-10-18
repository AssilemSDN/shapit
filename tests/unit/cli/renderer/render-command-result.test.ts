import { afterEach, describe, expect, it, vi } from 'vitest'

import { renderCommandResult } from '../../../../src/cli/renderer/render-command-result.js'
import { logger } from '../../../../src/utils/logger.js'
import { renderCommandResultScenarios } from './render-command-result.scenarios.js'

describe('renderCommandResult', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(renderCommandResultScenarios)('$name', ({ result, expected }) => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(logger, 'error').mockImplementation(() => {})
    const success = vi.spyOn(logger, 'success').mockImplementation(() => {})
    const debug = vi.spyOn(logger, 'debug').mockImplementation(() => {})
    const renderData = vi.fn<(data: string) => void>()

    renderCommandResult({
      commandName: 'audit',
      result,
      renderData,
    })

    expect(warn.mock.calls).toEqual(expected.warn.map((msg) => [msg]))
    expect(error.mock.calls).toEqual(expected.error.map((msg) => [msg]))
    expect(success.mock.calls).toEqual(expected.success.map((msg) => [msg]))
    expect(renderData.mock.calls).toEqual(expected.data !== undefined ? [[expected.data]] : [])
    expect(debug).toHaveBeenCalledWith('Command result: ', result)
  })
})
