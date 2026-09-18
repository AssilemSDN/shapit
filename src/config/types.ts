import type { z } from 'zod'

import type { shapitConfigSchema } from './schema.js'

/**
 * Represents the type for the Shapit configuration.
 */
export type ShapitConfig = z.infer<typeof shapitConfigSchema>

/**
 * Represents the type for a rule definition within the Shapit configuration.
 */
export type RuleDefinition = ShapitConfig['rules'][number]
