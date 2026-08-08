/*
  PATH /src/utils/exit-codes.ts
*/
export const ExitCodes = {
  // All rules OK
  SUCCESS: {
    code: 0,
    label: "SUCCESS",
    desc: "Everything went fine",
  },

  // At least one rule not OK
  AUDIT_FAILED: {
    code: 1,
    label: "AUDIT_FAILED",
    desc: "Audit failed due to rule violations",
  },

  // Invalid config
  USER_ERROR: {
    code: 2,
    label: "USER_ERROR",
    desc: "Invalid input or user mistake",
  },

  // Unexpected internal error
  INTERNAL_ERROR: {
    code: 3,
    label: "INTERNAL_ERROR",
    desc: "Unexpected internal error",
  },
} as const;
