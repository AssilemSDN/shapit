import { z } from 'zod'

import type { StructureInput } from './types.js'

/**
 * Defines the schema for validating the input of the "structure" rule using Zod.
 *
 * This schema ensures that the input adheres to the expected structure, including:
 * - `path`: A non-empty string representing the file or directory path.
 * - `kind`: An enumeration indicating the type of path, which can be 'file', 'directory', or 'any'. Defaults to 'any'.
 * - `must`: An enumeration specifying whether the path must 'exist' or 'not_exist'. Defaults to 'exist'.
 */
export const structureInputSchema = z
  .object({
    path: z.string().min(1),
    kind: z.enum(['file', 'directory', 'any']).default('any'),
    must: z.enum(['exist', 'not_exist']).default('exist'),
  })
  .strict()
  .transform((value): StructureInput => ({
    path: value.path,
    kind: value.kind,
    must: value.must,
  }))
