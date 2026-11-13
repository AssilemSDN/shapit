import { realpath } from 'node:fs/promises'
import path from 'node:path'

import { AppError } from '../errors/app-error.js'
import { ErrorCodes } from '../errors/error-codes.js'

const isInside = (base: string, target: string): boolean => {
  const relative = path.relative(base, target)
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)
}

const assertInside = (base: string, target: string, targetPath: string): void => {
  if (!isInside(base, target)) {
    throw new AppError(`Path escapes allowed directory: "${targetPath}"`, {
      code: ErrorCodes.PATH_OUTSIDE_BASE_DIRECTORY,
      details: {
        baseDir: base,
        targetPath,
        resolvedPath: target,
      },
    })
  }
}

/**
 * Resolves a path relative to a base directory. Prevents lexical path traversal without following symbolic links.
 *
 * The target does not need to exist.
 *
 * @param baseDir - The base directory.
 * @param targetPath - The target path to resolve.
 * @returns The resolved absolute path.
 * @throws {AppError} If the path escapes the base directory.
 */
export const resolvePathInside = (baseDir: string, targetPath: string): string => {
  const resolvedBase = path.resolve(baseDir)
  const resolvedTarget = path.resolve(resolvedBase, targetPath)
  assertInside(resolvedBase, resolvedTarget, targetPath)
  return resolvedTarget
}

/**
 * Resolves a path relative to a base directory. Prevents lexical traversal and escaping through symbolic links.
 *
 * Both the base directory and target must exist.
 *
 * @param baseDir - The base directory.
 * @param targetPath - The target path to resolve.
 * @returns The resolved real path.
 * @throws {AppError} If the path escapes the base directory.
 */
export const resolveRealPathInside = async (
  baseDir: string,
  targetPath: string,
): Promise<string> => {
  const absolutePath = resolvePathInside(baseDir, targetPath)
  const [realBase, realTarget] = await Promise.all([realpath(baseDir), realpath(absolutePath)])
  assertInside(realBase, realTarget, targetPath)
  return realTarget
}
