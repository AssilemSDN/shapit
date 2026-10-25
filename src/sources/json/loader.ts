import { readFile } from 'node:fs/promises'
import { query } from 'jsonpathly'
import { resolvePathInside } from '../../utils/resolve-project-path.js'
import type { SourceLoader } from '../types.js'
import type { JsonSource } from './schema.js'
import { AppError } from '../../errors/AppError.js'
import { ErrorCodes } from '../../errors/error-codes.js'

/**
 * Loads and extracts values from a JSON file using JSONPath.
 */
export const jsonSourceLoader: SourceLoader<JsonSource> = {
  key: (config, baseDir) => `json:${resolvePathInside(baseDir, config.file)}`,

  async read(config, baseDir) {
    const filePath = resolvePathInside(baseDir, config.file)
    let content: string

    try {
      content = await readFile(filePath, 'utf-8')
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new AppError(`Source file not found: "${config.file}"`, {
          code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
          details: {
            file: config.file,
          },
          cause: error,
        })
      }
      throw new AppError(`Cannot read source file "${config.file}"`, {
        code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
        details: { file: config.file },
        cause: error,
      })
    }

    try {
      return JSON.parse(content)
    } catch (error) {
      throw new AppError(`Invalid JSON in source file "${config.file}"`, {
        code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
        details: {
          file: config.file,
        },
        cause: error,
      })
    }
  },

  select: (data, config) => query(data, config.select, { returnArray: true }) as unknown[],
}
