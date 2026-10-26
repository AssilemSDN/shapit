import { z } from 'zod'
import { ErrorCodes } from '../errors/error-codes.js'
import { sourceConfigSchema } from '../sources/registry.js'

export const LATEST_CONFIG_VERSION = 1
export const DEFAULT_CONFIG_VERSION = 1

/**
 * Defines the schema for the Shapit configuration using Zod.
 *
 * This schema validates the structure of the configuration file, ensuring that it adheres to the expected format and contains all required properties.
 *
 * The schema includes:
 * - `version`: A literal value representing the configuration version, defaulting to `DEFAULT_CONFIG_VERSION`.
 * - `rules`: An array of rule definitions, where each rule is an object containing:
 *   - `id`: A non-empty string that uniquely identifies the rule.
 *   - `type`: A non-empty string indicating the type of the rule.
 *   - `description`: An optional non-empty string providing a description of the rule.
 *   - `parameters`: An optional property that can hold any value (unknown) for additional rule parameters.
 *
 * The schema also enforces strict validation, refusing any unknown properties in the configuration object. Additionally, it includes a custom refinement to ensure that all rule IDs are unique within the configuration.
 *
 * @throws {ZodError} Throws a ZodError if the configuration does not conform to the schema, including duplicate rule IDs.  
 */
export const shapitConfigSchema = z
  .object({
    // All known version
    version: z.literal(1).default(DEFAULT_CONFIG_VERSION),
    // The 'rules' property is an array of rule definitions
    rules: z.array(
      // Each rule definition is an object
      z
        .object({
          // The 'id' property is a non-empty string
          id: z
            .string()
            .min(1)
            .regex(/^[^#]+$/, 'Rule ID must not contain "#"'),
          // The 'type' property is a non-empty string
          type: z.string().min(1),
          description: z.string().min(1).optional(),
          source: sourceConfigSchema.optional(),
          // The 'parameters' property can be any value (unknown)
          parameters: z.unknown().optional(),
        })
        .strict(),
    ),
    // refuse unknown properties in the configuration object
  })
  .strict()
  .superRefine((data, ctx) => {
    // Check unicity of id
    const idSeen = new Set<string>()
    data.rules.forEach((rule, index) => {
      if (idSeen.has(rule.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['rules', index, 'id'],
          message: `Duplicate rule ID: "${rule.id}"`,
          params: {
            errorCode: ErrorCodes.DUPLICATE_RULE_ID,
            ruleId: rule.id,
          },
        })
      } else {
        idSeen.add(rule.id)
      }
    })
  })
