import { afterEach, describe, expect, it, vi } from 'vitest'
import logSymbols from 'log-symbols'

import { logger } from '../../../src/utils/logger.js'

const initialLevel = logger.level

describe('logger', () => {
  afterEach(() => {
    logger.level = initialLevel
    vi.restoreAllMocks()
  })

  it('writes messages to the correct output', () => {
    const stdout = vi.spyOn(console, 'log').mockImplementation(() => {})
    const stderr = vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.level = 'info'
    logger.info('info')
    logger.success('success')
    logger.warn('warning')
    logger.error('error')
    expect(stdout.mock.calls).toEqual([
      [logSymbols.info, 'info'],
      [logSymbols.success, 'success'],
    ])
    expect(stderr.mock.calls).toEqual([
      [logSymbols.warning, 'warning'],
      [logSymbols.error, 'error'],
    ])
  })

  it.each([
    ['error', 0, 1],
    ['warn', 0, 2],
    ['info', 2, 2],
    ['debug', 2, 3],
  ] as const)('filters messages at %s level', (level, out, err) => {
    const stdout = vi.spyOn(console, 'log').mockImplementation(() => {})
    const stderr = vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.level = level
    logger.error('error')
    logger.warn('warning')
    logger.info('info')
    logger.success('success')
    logger.debug('debug')
    expect(stdout).toHaveBeenCalledTimes(out)
    expect(stderr).toHaveBeenCalledTimes(err)
  })

  it('formats debug messages', () => {
    const stderr = vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.level = 'debug'
    logger.debug('details')
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining('[DEBUG]'),
      logSymbols.info,
      'details',
    )
  })
})
