import { writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { AppError } from '../errors/app-error.js'
import { ErrorCodes } from '../errors/error-codes.js'
import { minimalTemplate } from '../templates/minimal.js'
import { confirmCreateConfig } from '../prompts/init-prompts.js'

export type InitResult =
  | { status: 'created'; configPath: string }
  | { status: 'cancelled'; configPath: string }

const DEFAULT_CONFIG = minimalTemplate

/**
 * Creates a starter Shapit configuration without overwriting existing files.
 */
export const init = async (projectDir: string, configFileName: string): Promise<InitResult> => {
  const directory = resolve(projectDir)
  if (
    !configFileName.trim() ||
    configFileName === '.' ||
    configFileName === '..' ||
    /[\\/:\0]/.test(configFileName)
  ) {
    throw new AppError(`Invalid configuration filename: "${configFileName}"`, {
      code: ErrorCodes.INVALID_CONFIG,
      details: { configFileName },
    })
  }
  const configPath = join(directory, configFileName)

  const confirmed = await confirmCreateConfig(configPath)

  if (!confirmed) {
    return {
      status: 'cancelled',
      configPath,
    }
  }

  try {
    await writeFile(configPath, DEFAULT_CONFIG, { encoding: 'utf8', flag: 'wx' })
  } catch (error: unknown) {
    const code = error instanceof Error && 'code' in error ? error.code : undefined
    if (code === 'EEXIST') {
      throw new AppError(`Configuration file already exists: "${configPath}"`, {
        code: ErrorCodes.CONFIG_ALREADY_EXISTS,
        details: { path: configPath },
        cause: error,
      })
    }
    if (code === 'ENOENT' || code === 'ENOTDIR') {
      throw new AppError(`Project directory not found: "${directory}"`, {
        code: ErrorCodes.PATH_NOT_FOUND,
        details: { path: directory },
        cause: error,
      })
    }
    if (code === 'EACCES' || code === 'EPERM') {
      throw new AppError(`Permission denied creating configuration: "${configPath}"`, {
        code: ErrorCodes.PERMISSION_DENIED,
        details: { path: configPath },
        cause: error,
      })
    }
    throw new AppError(`Unable to create configuration file: "${configPath}"`, {
      code: ErrorCodes.CONFIG_WRITE_ERROR,
      details: { path: configPath },
      cause: error,
    })
  }

  return {
    status: 'created',
    configPath,
  }
}
