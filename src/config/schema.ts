import { z } from 'zod'
import { ErrorCodes } from '../errors/error-codes.js'

export const LATEST_CONFIG_VERSION = 1
export const DEFAULT_CONFIG_VERSION = 1

/**
 * Defines the schema for the Shapit configuration file using Zod.
 * The configuration consists of an array of rule definitions, where each rule has:
 * - id: A non-empty string that uniquely identifies the rule.
 * - type: A non-empty string that specifies the type of the rule.
 * - parameters: An unknown value that holds the parameters for the rule.
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
          id: z.string().min(1),
          // The 'type' property is a non-empty string
          type: z.string().min(1),
          description: z.string().min(1).optional(),
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
