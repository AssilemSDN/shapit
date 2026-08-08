import { extname } from "node:path";

import type { RuleResult } from "../../core/types.js";
import type { StructureObservedInput } from "./types.js";

/**
 * Audits the provided StructureObservedInput to determine if it meets
 * the specified requirements.
 *
 * @param input - The StructureObservedInput containing observed information about
 * the file system.
 * @returns A RuleResult indicating whether the input is valid and any associated message.
 */
export const auditStructure = (input: StructureObservedInput): RuleResult => {
  if (!input.exists) {
    if (input.required) {
      return {
        valid: false,
        message: `Required path "${input.path}" does not exist`,
      };
    }

    return { valid: true };
  }

  if (input.actualType !== input.pathType) {
    return {
      valid: false,
      message: `"${input.path}" must be a ${input.pathType}`,
    };
  }

  if (
    input.pathType === "file" &&
    input.fileExtension?.length &&
    !input.fileExtension.includes(extname(input.path))
  ) {
    return {
      valid: false,
      message: `"${input.path}" must use one of these extensions: ${input.fileExtension.join(", ")}`,
    };
  }

  return {
    valid: true,
  };
};
