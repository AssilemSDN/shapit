import path from 'node:path'

import { AppError } from '../errors/AppError.js'
import { ErrorCodes } from '../errors/error-codes.js'

/**
 * Resolves a path and ensures it stays inside the allowed base directory.
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
