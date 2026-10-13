import { z } from 'zod'

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
