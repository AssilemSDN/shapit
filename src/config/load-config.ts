import { readFile } from 'node:fs/promises'

import YAML from 'yaml'

import { shapitConfigSchema } from './schema.js'
import type { LoadedConfig } from './types.js'

import { AppError } from '../errors/AppError.js'
import { ErrorCodes } from '../errors/error-codes.js'

/**
 * Loads and parses the Shapit configuration file from the specified path.
 *
 * @param path - The file path to the Shapit configuration file.
 * @returns A promise that resolves to the parsed Shapit configuration and any warnings encountered during loading.
 * @throws {AppError} Throws an AppError if the configuration file is not found, contains invalid YAML, or does not conform to the expected schema.
 */
export const loadConfig = async (path: string): Promise<LoadedConfig> => {
  let content: string

  try {
    content = await readFile(path, 'utf8')
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      throw new AppError(`Configuration file not found: "${path}"`, {
        code: ErrorCodes.CONFIG_NOT_FOUND,
        details: { path },
      })
    }
    throw err
  }

  let rawConfig: unknown

  try {
    rawConfig = YAML.parse(content)
  } catch (err: unknown) {
    const message = err instanceof Error ? `: ${err.message}` : ''

    throw new AppError(`Invalid YAML in configuration file "${path}"${message}`, {
      code: ErrorCodes.INVALID_YAML,
      cause: err,
    })
  }

  const result = shapitConfigSchema.safeParse(rawConfig)

  if (!result.success) {
    throw new AppError(`Invalid Shapit configuration in "${path}"`, {
      code: ErrorCodes.INVALID_CONFIG,
      details: result.error.issues,
    })
  }

  const warnings: string[] = []

  if (
    typeof rawConfig === 'object' &&
    rawConfig !== null &&
    !Array.isArray(rawConfig) &&
    !Object.hasOwn(rawConfig, 'version')
  ) {
    warnings.push(`Configuration version not specified. Using version ${result.data.version}.`)
  }

  return {
    config: result.data,
    warnings,
  }
}
