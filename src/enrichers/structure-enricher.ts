import type { Stats } from 'node:fs'
import { stat } from 'node:fs/promises'
import { expand } from 'brace-expansion'

import type {
  PathObservation,
  StructureInput,
  StructureObservedInput,
} from '../rules/structure/types.js'
import type { Enricher } from './types.js'
import { AppError } from '../errors/AppError.js'
import { ErrorCodes } from '../errors/error-codes.js'
import { resolvePathInside } from '../utils/resolve-project-path.js'

const getPathType = (stats: Stats): PathObservation['actualType'] => {
  if (stats.isFile()) {
    return 'file'
  }
  if (stats.isDirectory()) {
    return 'directory'
  }
  return 'other'
}

const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error && 'code' in error
}

/**
 * Inspects a resolved file system path.
 *
 * @param path - The relative path to inspect.
 * @param cwd - The project's working directory.
 * @returns The observed existence and type of the path.
 * @throws {AppError} If access to the path is denied.
 */
const observePath = async (path: string, cwd: string): Promise<PathObservation> => {
  const absolutePath = resolvePathInside(cwd, path)

  try {
    const stats = await stat(absolutePath)

    return {
      path,
      exists: true,
      actualType: getPathType(stats),
    }
  } catch (error) {
    if (!isNodeError(error)) {
      throw error
    }

    if (error.code === 'ENOENT') {
      return {
        path,
        exists: false,
      }
    }

    if (error.code === 'EACCES' || error.code === 'EPERM') {
      throw new AppError(`Permission denied: "${path}"`, {
        code: ErrorCodes.PERMISSION_DENIED,
        details: { path: absolutePath },
        cause: error,
      })
    }

    throw error
  }
}

/**
 * Enriches the structure input by observing the specified paths and determining their existence and types.
 *
 * Expands brace expressions into individual paths, resolves them relative
 * to the project's working directory, and inspects their existence and type.
 *
 * Observations are collected concurrently and preserve expansion order.
 * This enricher does not evaluate rule requirements.
 *
 * @param input - The structure input containing the path to observe.
 * @param context - The project context providing necessary information for enrichment.
 * @returns A promise that resolves to the enriched structure observed input.
 * @throws {AppError} Throws an AppError if any path escapes the base directory or if access to a path is denied.
 */
export const enrichStructureInput: Enricher<StructureInput, StructureObservedInput> = async (
  input,
  context,
) => {
  const paths = [...new Set(expand(input.path))]

  const observations = await Promise.all(paths.map((path) => observePath(path, context.cwd)))

  return {
    ...input,
    observations,
  }
}
