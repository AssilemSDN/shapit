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

/**
 * Represents the type for a loaded Shapit configuration, including the configuration itself and any warnings encountered during loading.
 *
 * @property config - The loaded Shapit configuration.
 * @property warnings - An array of warning messages encountered during the loading of the configuration.
 */
export interface LoadedConfig {
  config: ShapitConfig
  warnings: string[]
}
