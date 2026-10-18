import { z } from 'zod'

/**
 * Formats error details into a list of strings.
 *
 * @param details - The error details to format, which can be an array of Zod issues or any other type.
 * @returns An array of formatted error messages as strings. If the input is not an array, an empty array is returned.
 */
export function formatErrorDetails(details: unknown): string[] {
  if (!Array.isArray(details)) {
    return []
  }
  return details
    .filter(
      (issue): issue is z.core.$ZodIssue =>
        typeof issue === 'object' &&
        issue !== null &&
        'message' in issue &&
        typeof issue.message === 'string',
    )
    .map((issue) => {
      const path = issue.path.join('.')
      return path ? `${issue.message} (${path})` : issue.message
    })
}
