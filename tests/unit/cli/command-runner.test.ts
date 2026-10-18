import { describe, afterEach, expect, it, vi } from 'vitest'
import { runCommand } from '../../../src/cli/command-runner.js'
import { renderCommandResult } from '../../../src/cli/renderer/render-command-result.js'
import { renderUnexpectedError } from '../../../src/cli/renderer/render-unexpected-error.js'

vi.mock('../../../src/cli/renderer/render-command-result.js')
vi.mock('../../../src/cli/renderer/render-unexpected-error.js')

describe('runCommand', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([0, 1, 2] as const)('handle exit code %d', async (exitCode) => {
    const result = {
      success: exitCode === 0,
      exitCode,
      warnings: [],
    }
    const mockCommandFn = vi.fn().mockResolvedValue(result)
    await runCommand({
      commandName: 'audit',
      commandFn: mockCommandFn,
      options: {},
    })
    expect(mockCommandFn).toHaveBeenCalledWith({})
    expect(renderCommandResult).toHaveBeenCalledWith({
      commandName: 'audit',
      result,
      renderData: undefined,
    })
    expect(process.exitCode).toBe(exitCode)
  })

  it('handle unexpected error', async () => {
    const error = new Error('Unexpected error')
    await runCommand({
      commandName: 'audit',
      commandFn: vi.fn().mockRejectedValue(error),
      options: {},
    })
    expect(renderUnexpectedError).toHaveBeenCalledWith('audit', error)
    expect(process.exitCode).toBe(2)
  })
})
