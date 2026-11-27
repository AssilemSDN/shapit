import type { Stats } from 'node:fs'
import path from 'node:path'
import { lstat, realpath } from 'node:fs/promises'
import { expand } from 'brace-expansion'

import type {
  PathObservation,
  StructureInput,
  StructureObservedInput,
} from '../rules/structure/types.js'
import type { Enricher } from './types.js'
import { AppError } from '../errors/app-error.js'
import { ErrorCodes } from '../errors/error-codes.js'
import { isInside, resolvePathInside } from '../utils/resolve-project-path.js'

/**
 * Determines the type of a file system entry based on its stats.
 * @param stats The stats of the file system entry.
 * @returns The type of the file system entry as a string ('file', 'directory', 'symlink', or 'other').
 */
const getPathType = (stats: Stats): PathObservation['actualType'] => {
  if (stats.isSymbolicLink()) {
    return 'symlink'
  }
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

const isMissingPathError = (error: unknown): boolean =>
  isNodeError(error) && (error.code === 'ENOENT' || error.code === 'ENOTDIR')

/**
 * Inspects a resolved file system path.
 *
 * @param relativePath - The relative path to inspect.
 * @param cwd - The project's working directory.
 * @param realBase - The canonical project root.
 * @returns The observed existence and type of the path.
 * @throws {AppError} If access is denied or a parent path escapes the project.
 */
const observePath = async (
  relativePath: string,
  cwd: string,
  realBase: string,
): Promise<PathObservation> => {
  const absolutePath = resolvePathInside(cwd, relativePath)

  try {
    // Ensure the parent directory stays inside the project
    const realParent =
      absolutePath === path.resolve(cwd) ? realBase : await realpath(path.dirname(absolutePath))

    if (!isInside(realBase, realParent)) {
      throw new AppError(`Path escapes allowed directory: "${relativePath}"`, {
        code: ErrorCodes.PATH_OUTSIDE_BASE_DIRECTORY,
        details: {
          baseDir: realBase,
          targetPath: relativePath,
          resolvedPath: realParent,
        },
      })
    }
    // Observe the entry without following the final symlink
    const entry = await lstat(absolutePath)
    return {
      path: relativePath,
      exists: true,
      actualType: getPathType(entry),
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    if (isMissingPathError(error)) {
      return {
        path: relativePath,
        exists: false,
      }
    }
    if (isNodeError(error) && error.code === 'ELOOP') {
      throw new AppError(`Symbolic link cycle: "${relativePath}"`, {
        code: ErrorCodes.RULE_EXECUTION_ERROR,
        details: { path: absolutePath },
        cause: error,
      })
    }
    if (isNodeError(error) && (error.code === 'EACCES' || error.code === 'EPERM')) {
      throw new AppError(`Permission denied: "${relativePath}"`, {
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
  const realBase = await realpath(context.cwd)

  const observations = await Promise.all(
    paths.map((path) => observePath(path, context.cwd, realBase)),
  )

  return {
    ...input,
    observations,
  }
}
