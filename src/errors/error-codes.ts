export const ErrorCodes = {
  // Internal
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  AUDIT_EXECUTION_ERROR: 'AUDIT_EXECUTION_ERROR',
  RULE_EXECUTION_ERROR: 'RULE_EXECUTION_ERROR',

  // Config
  CONFIG_NOT_FOUND: 'CONFIG_NOT_FOUND',
  CONFIG_READ_ERROR: 'CONFIG_READ_ERROR',
  INVALID_CONFIG: 'INVALID_CONFIG',
  INVALID_YAML: 'INVALID_YAML',

  // Rules
  UNKNOWN_RULE_TYPE: 'UNKNOWN_RULE_TYPE',
  INVALID_RULE_CONFIG: 'INVALID_RULE_CONFIG',
  DUPLICATE_RULE_ID: 'DUPLICATE_RULE_ID',

  // Filesystem / project
  PATH_NOT_FOUND: 'PATH_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  PATH_OUTSIDE_BASE_DIRECTORY: 'PATH_OUTSIDE_BASE_DIRECTORY',
} as const

/**
 * Represents the set of error codes used throughout the application.
 * Each error code corresponds to a specific type of error that can occur during execution.
 */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
