import { z } from 'zod'

import type { StructureInput } from './types.js'

/**
 * Validates the parameters of a structure rule and transforms
 * YAML properties into the internal StructureInput representation.
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
