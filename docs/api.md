# Programmatic API

Shapit exposes an API for loading configurations and auditing projects without the CLI.

> [!NOTE]
> The API may change during the `0.x` release series.

## Exports

| Export                   | Description                               |
| ------------------------ | ----------------------------------------- |
| `loadConfig()`           | Loads and validates a YAML configuration. |
| `audit()`                | Executes rules and returns audit results. |
| `AppError`, `ErrorCodes` | Application errors and error codes.       |

**Types:** `ShapitConfig`, `LoadedConfig`, `RuleDefinition`, `ProjectContext`, `RuleResult`, `AuditResult`, `ErrorCode`.

## Usage

```ts
import { loadConfig, audit } from '@bloup/shapit'

const { config, warnings } = await loadConfig('./shapit.yml')
const results = await audit(config, { cwd: process.cwd() })

const failed = results.filter((result) => !result.valid)

console.log({
  total: results.length,
  passed: results.length - failed.length,
  failed: failed.length,
  warnings,
})
```

## Results

`audit()` returns an `AuditResult[]`, with one result per rule instance.

| Property      | Description                               |
| ------------- | ----------------------------------------- |
| `id`          | Instance ID (`ruleId` or `ruleId#index`). |
| `ruleId`      | Original rule identifier.                 |
| `type`        | Rule type.                                |
| `description` | Optional rule description.                |
| `valid`       | Whether the rule passed.                  |
| `message`     | Optional result message.                  |

Rule failures return `valid: false`. Configuration and execution errors may throw an `AppError`.

## Error handling

```ts
import { AppError } from '@bloup/shapit'

try {
  await audit(config, { cwd: process.cwd() })
} catch (error) {
  if (error instanceof AppError) {
    console.error(error.code, error.message)
  }
  throw error
}
```

`AppError` exposes `code`, optional `details` and `cause`. The API does not set process exit codes.
