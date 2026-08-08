/**
 * Represents the context of a project, including the current working directory (cwd)
 * where the audit is being performed.
 */
export interface ProjectContext {
  cwd: string;
}

/**
 * Represents the result of a rule execution, indicating whether the rule
 * passed or failed, along with an optional message providing additional context.
 */
export interface RuleResult {
  valid: boolean;
  message?: string;
}

/**
 * Represents the result of an audit, extending the rule result with additional
 * identifying information.
 */
export interface AuditResult extends RuleResult {
  id: string;
  type: string;
}
