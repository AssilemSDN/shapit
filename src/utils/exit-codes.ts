/*
  PATH /src/utils/exit-codes.ts
*/
export const ExitCodes = {
  // All rules OK
  SUCCESS: {
    code: 0,
    label: 'SUCCESS',
    desc: 'Everything went fine',
  },

  // At least one rule not OK
  AUDIT_FAILED: {
    code: 1,
    label: 'AUDIT_FAILED',
    desc: 'Audit failed due to rule violations',
  },

  // Command execution error
  ERROR: {
    code: 2,
    label: 'ERROR',
    desc: 'Command failed',
  },
} as const

export type ExitCode = (typeof ExitCodes)[keyof typeof ExitCodes]['code']
