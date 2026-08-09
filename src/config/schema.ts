import { z } from "zod";

/**
 * Defines the schema for the Shapit configuration file using Zod.
 * The configuration consists of an array of rule definitions, where each rule has:
 * - id: A non-empty string that uniquely identifies the rule.
 * - type: A non-empty string that specifies the type of the rule.
 * - parameters: An unknown value that holds the parameters for the rule.
 */
export const shapitConfigSchema = z.object({
  // The 'rules' property is an array of rule definitions
  rules: z.array(
    // Each rule definition is an object
    z.object({
      // The 'id' property is a non-empty string
      id: z.string().min(1),
      // The 'type' property is a non-empty string
      type: z.string().min(1),
      description: z.string().min(1).optional(),
      // The 'parameters' property can be any value (unknown)
      parameters: z.unknown(),
    }),
  ),
  // refuse unknown properties in the configuration object
}).strict();
