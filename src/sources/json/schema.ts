import { z } from 'zod'

/**
 * The schema for the JSON source configuration.
 */
export const jsonSourceSchema = z.strictObject({
  type: z.literal('json'),
  file: z.string().min(1).describe('The path to the JSON file to read from.'),
  select: z
    .string()
    .min(1)
    .describe('A JSONPath expression to select the data from the JSON file.'),
  as: z.string().min(1).optional().describe('An optional alias for the selected data.'),
})

export type JsonSource = z.infer<typeof jsonSourceSchema>
