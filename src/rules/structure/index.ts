import { enrichStructureInput } from '../../enrichers/structure-enricher.js'
import { createRuleExecutor } from '../types.js'

import { auditStructure } from './audit.js'
import { structureInputSchema } from './schema.js'

/**
 * Executor for the structure rule, combining parameter validation, filesystem observation and rule evaluation.
 *
 * This executor validates the input parameters against the defined schema, enriches the input data by observing the filesystem,
 * and performs the audit to determine if the specified structure conditions are met.
 */
export const structureRule = createRuleExecutor({
  schema: structureInputSchema,
  enricher: enrichStructureInput,
  audit: auditStructure,
})
