import path from 'node:path'

import { AppError } from '../errors/app-error.js'
import { ErrorCodes } from '../errors/error-codes.js'

/**
 * Resolves a target path relative to a base directory, ensuring that the resolved path does not escape the base directory.
 *
 * @param baseDir - The base directory from which the target path is resolved.
 * @param targetPath - The target path to resolve relative to the base directory.
 * @returns The resolved absolute path of the target, if it is within the base directory.
 * @throws {AppError} Throws an AppError if the resolved target path escapes the base directory.
 */
export const resolvePathInside = (baseDir: string, targetPath: string): string => {
  const resolvedBase = path.resolve(baseDir)
  const resolvedTarget = path.resolve(resolvedBase, targetPath)
  const relativePath = path.relative(resolvedBase, resolvedTarget)

  const escapesBase =
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)

  if (escapesBase) {
    throw new AppError(`Path escapes allowed directory: "${targetPath}"`, {
      code: ErrorCodes.PATH_OUTSIDE_BASE_DIRECTORY,
      details: {
        baseDir: resolvedBase,
        targetPath,
        resolvedPath: resolvedTarget,
      },
    })
  }

  return resolvedTarget
}
