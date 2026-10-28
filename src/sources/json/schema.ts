import { z } from 'zod'

const aliasSchema = z
  .string()
  .regex(/^[a-zA-Z_]\w*$/, 'Invalid source alias')
  .refine(
    (value) => !['__proto__', 'prototype', 'constructor'].includes(value),
    'Reserved source alias',
  )

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
  as: aliasSchema.optional().describe('An optional alias for the selected data.'),
})

export type JsonSource = z.infer<typeof jsonSourceSchema>
