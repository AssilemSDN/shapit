import type { ShapitConfig } from '../config/types.js'
import { AppError } from '../errors/AppError.js'
import { ruleRegistry } from '../rules/registry.js'
import type { AuditResult, ProjectContext } from './types.js'

/**
 * Audits the project based on the provided configuration and context.
 *
 * @param config - The Shapit configuration containing the rules to audit.
 * @param context - The project context providing necessary information for auditing.
 * @returns A promise that resolves to an array of audit results.
 */
export const audit = async (
  config: ShapitConfig,
  context: ProjectContext,
): Promise<AuditResult[]> => {
  // Initialize an array to hold the results of the audit
  const results: AuditResult[] = []

  // Iterate over each rule definition in the configuration
  for (const definition of config.rules) {
    const executor = ruleRegistry[definition.type]

    if (!executor) {
      throw new AppError(`Unknown rule type "${definition.type}"`, {
        code: 'UNKNOWN_RULE_TYPE',
        details: {
          ruleId: definition.id,
          ruleType: definition.type,
        },
      })
    }

    const result = await executor.execute(definition.parameters, context)

    results.push({
      id: definition.id,
      type: definition.type,
      description: definition.description,
      ...result,
    })
  }

  return results
}
