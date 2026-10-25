import type { RuleDefinition, ShapitConfig } from '../config/types.js'
import { AppError } from '../errors/AppError.js'
import { ErrorCodes } from '../errors/error-codes.js'
import { ruleRegistry } from '../rules/registry.js'
import { resolveSource, type SourceCache } from '../sources/resolve-source.js'
import { interpolate } from './interpolate.js'
import type { AuditResult, ProjectContext } from './types.js'

interface RuleInstance {
  id: string
  ruleId: string
  parameters: unknown
}

/**
 * Turns a rule definition into one or more rule instances.
 *
 * @param definition the rule definition to build instances from
 * @param cwd the current working directory of the project
 * @returns the resolved rule instances
 * @throws {AppError} Throws an AppError if an error occurs during the instance building process
 */
const buildInstances = async (
  definition: RuleDefinition,
  cwd: string,
  sourceCache: SourceCache,
): Promise<RuleInstance[]> => {
  const { id, type, source, parameters } = definition
  // A single instance is created if no source is provided
  if (!source) {
    return [{ id, ruleId: id, parameters }]
  }
  // If a source is provided, resolve it and create an instance for each set of variables
  const details = { ruleId: id, ruleType: type }

  try {
    const contexts = await resolveSource(source, cwd, sourceCache)

    if (contexts.length === 0) {
      throw new AppError(`No contexts resolved for rule "${id}"`, {
        code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
        details,
      })
    }

    return contexts.map((variables, i): RuleInstance => {
      const resolved = interpolate(parameters, variables)
      if (resolved == null || typeof resolved !== 'object' || Array.isArray(resolved)) {
        throw new AppError(`Invalid parameters resolved for rule "${id}"`, {
          code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
          details: {
            ...details,
            contextIndex: i,
            resolvedParameters: resolved,
          },
        })
      }
      return {
        id: `${id}#${i}`,
        ruleId: id,
        parameters: resolved,
      }
    })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(`Error resolving source for rule "${id}"`, {
      code: ErrorCodes.SOURCE_RESOLUTION_ERROR,
      details,
      cause: error,
    })
  }
}

/**
 * Audits the project based on the provided configuration and context.
 *
 * @param config - The Shapit configuration containing the rules to audit.
 * @param context - The project context providing necessary information for auditing.
 * @returns A promise that resolves to an array of audit results.
 * @throws {AppError} Throws an AppError if an error occurs during the audit process.
 */
export const audit = async (
  config: ShapitConfig,
  context: ProjectContext,
): Promise<AuditResult[]> => {
  // Initialize an array to hold the results of the audit
  const results: AuditResult[] = []
  const sourceCache: SourceCache = new Map()

  // Iterate over each rule definition in the configuration
  for (const definition of config.rules) {
    const executor = ruleRegistry[definition.type]

    if (!executor) {
      throw new AppError(`Unknown rule type "${definition.type}"`, {
        code: ErrorCodes.UNKNOWN_RULE_TYPE,
        details: {
          ruleId: definition.id,
          ruleType: definition.type,
        },
      })
    }

    const instances = await buildInstances(definition, context.cwd, sourceCache)

    for (const instance of instances) {
      try {
        const result = await executor.execute(instance.parameters, context)
        results.push({
          ...result,
          id: instance.id,
          ruleId: definition.id,
          type: definition.type,
          description: definition.description,
        })
      } catch (error) {
        if (error instanceof AppError) {
          if (error.code === ErrorCodes.INVALID_RULE_CONFIG) {
            throw new AppError(`Invalid rule parameters for "${instance.id}"`, {
              code: error.code,
              details: {
                ruleId: definition.id,
                instanceId: instance.id,
                ruleType: definition.type,
                ...(typeof error.details === 'object' && error.details !== null
                  ? error.details
                  : {}),
              },
              cause: error,
            })
          }
          throw error
        }
        throw new AppError(`Error executing rule "${instance.id}"`, {
          code: ErrorCodes.RULE_EXECUTION_ERROR,
          details: {
            ruleId: definition.id,
            instanceId: instance.id,
            ruleType: definition.type,
          },
          cause: error,
        })
      }
    }
  }

  return results
}
