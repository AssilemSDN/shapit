export { loadConfig } from './config/load-config.js'
export { audit } from './core/audit.js'

export { AppError } from './errors/AppError.js'
export { ErrorCodes } from './errors/error-codes.js'

export type { ErrorCode } from './errors/error-codes.js'
export type { ShapitConfig } from './config/types.js'
export type { ProjectContext, RuleResult, AuditResult } from './core/types.js'
