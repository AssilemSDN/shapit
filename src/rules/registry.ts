import type { RuleExecutor } from './types.js'
import { structureRule } from './structure/index.js'

/**
 * A registry that maps rule names to their corresponding RuleExecutor instances.
 * This allows for easy retrieval and execution of rules based on their names.
 */
export const ruleRegistry: Record<string, RuleExecutor> = {
  structure: structureRule,
}
