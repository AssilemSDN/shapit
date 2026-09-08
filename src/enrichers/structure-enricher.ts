import type { Stats } from 'node:fs'
import { stat } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { PathType, StructureInput, StructureObservedInput } from '../rules/structure/types.js'
import type { Enricher } from './types.js'

const getPathType = (stats: Stats): PathType | 'other' => {
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
 * Enriches the provided StructureInput with observed information about the file system.
 *
 * @param input - The StructureInput containing the path and expected type.
 * @param context - The project context providing necessary information for enrichment.
 * @returns A promise that resolves to a StructureObservedInput with additional observed data.
 */
export const enrichStructureInput: Enricher<StructureInput, StructureObservedInput> = async (
  input,
  context,
) => {
  const absolutePath = resolve(context.cwd, input.path)

  try {
    const stats = await stat(absolutePath)

    return {
      ...input,
      exists: true,
      actualType: getPathType(stats),
    }
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return {
        ...input,
        exists: false,
      }
    }

    throw error
  }
}
