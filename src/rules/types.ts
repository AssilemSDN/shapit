import type { ZodType } from 'zod'

import type { Enricher } from '../enrichers/types.js'
import type { ProjectContext, RuleResult } from '../core/types.js'

import { AppError } from '../errors/AppError.js'
import { ErrorCodes } from '../errors/error-codes.js'

/**
 * Represents a rule that can be executed within the Shapit framework.
 * @template TInput - The type of the input data for the rule.
 * @template TObservedInput - The type of the observed input data after enrichment.
 */
export interface Rule<TInput, TObservedInput> {
  schema: ZodType<TInput>
  enricher: Enricher<TInput, TObservedInput>
  audit: (input: TObservedInput) => RuleResult | Promise<RuleResult>
}

/**
 * Represents the executor for a rule, responsible for validating, enriching,
 * and auditing the input data.
 */
export interface RuleExecutor {
  execute(parameters: unknown, context: ProjectContext): Promise<RuleResult>
}

/**
 * Creates a RuleExecutor for a given rule, allowing for the execution of the rule's
 * validation, enrichment, and auditing processes.
 * @template TInput - The type of the input data for the rule.
 * @template TObservedInput - The type of the observed input data after enrichment.
 * @param rule - The rule to create an executor for.
 * @returns A RuleExecutor that can execute the provided rule.
 */
export const createRuleExecutor = <TInput, TObservedInput>(
  rule: Rule<TInput, TObservedInput>,
): RuleExecutor => {
  return {
    async execute(parameters, context) {
      const parsed = rule.schema.safeParse(parameters)

      if (!parsed.success) {
        throw new AppError('Invalid rule parameters', {
          code: ErrorCodes.INVALID_RULE_CONFIG,
          details: parsed.error.issues,
        })
      }

      const observedInput = await rule.enricher(parsed.data, context)

      return rule.audit(observedInput)
    },
  }
}
