# Usage & configuration

This document covers Shapit's CLI usage, configuration format, supported rules, and programmatic API.

## Run an audit

Run Shapit using:

```bash
shapit audit [project-dir] [options]
```

By default:

- the current directory is audited;
- Shapit loads `shapit.yml` from that directory.

Examples:

```bash
# Audit the current directory
npx shapit audit

# Audit another project
npx shapit audit ../my-project

# Use a custom configuration file
npx shapit audit --config config/shapit.yml

# Combine a project directory and custom configuration
npx shapit audit ../my-project --config .config/shapit.yml
```

The configuration path is resolved relative to the audited project directory.

## Global options

| Option          | Description                   |
| --------------- | ----------------------------- |
| `-V, --version` | Display the installed version |
| `--debug`       | Enable debug logging          |
| `--quiet`       | Only display errors           |
| `-h, --help`    | Display help                  |

> `--debug` and `--quiet` are mutually exclusive.

## Audit options

| Argument / Option     | Description                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `project-dir`         | Directory to audit. Defaults to the current working directory.                                   |
| `-c, --config <path>` | Configuration file to load, relative to the audited project directory. Defaults to `shapit.yml`. |

The configuration file can be located outside the audited project by providing an appropriate relative or absolute path. Rule paths remain relative to the audited project root.

## Configuration

Shapit uses a declarative YAML configuration file, named `shapit.yml` by default, to define project standards.

**Example:**

```yaml
version: 1

rules:
  - id: readme
    type: structure
    description: A README file must exist
    parameters:
      path: README.{md,txt}
      kind: file
      must: exist
```

### Configuration properties

| Property  | Required | Description                                                                |
| --------- | -------- | -------------------------------------------------------------------------- |
| `version` | No       | Configuration format version. Defaults to `1` with a warning when omitted. |
| `rules`   | Yes      | List of rule definitions.                                                  |

### Rule properties

| Property      | Required | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `id`          | Yes      | Unique, non-empty rule identifier.                   |
| `type`        | Yes      | Rule type. Currently, only `structure` is supported. |
| `description` | No       | Human-readable description of the rule.              |
| `parameters`  | Depends  | Parameters specific to the rule type.                |

Rule identifiers must be unique within the configuration.

Unknown configuration and rule properties are rejected. Rule parameters are validated separately according to their type.

## `structure` rule

The `structure` rule validates the presence or absence of files and directories within a project. It can also enforce the expected filesystem entry type.

### Parameters

| Parameter | Required | Default | Description                                                |
| --------- | -------- | ------- | ---------------------------------------------------------- |
| `path`    | Yes      | —       | Path to inspect, optionally containing brace alternatives. |
| `kind`    | No       | `any`   | Expected path type: `file`, `directory`, or `any`.         |
| `must`    | No       | `exist` | Existence requirement: `exist` or `not_exist`.             |

> [!NOTE]
> `kind` only applies when `must` is `exist`. When `must` is `not_exist`, any matching existing path violates the rule, regardless of its type.

### Required paths

Require a specific file or directory to exist:

```yaml
- id: package-json
  type: structure
  parameters:
    path: package.json
    kind: file
```

The rule passes when `package.json` exists and is a file.

### Forbidden paths

Prevent specific files or directories from existing:

```yaml
- id: no-env
  type: structure
  parameters:
    path: .env
    must: not_exist
```

The rule passes only when `.env` does not exist.

### Alternative paths

Brace expansion allows multiple alternatives in a single path expression.

```yaml
- id: readme
  type: structure
  parameters:
    path: README.{md,txt}
    kind: file
```

This expression checks `README.md` and `README.txt`.

- For `must: exist` - At least one alternative must exist and match the expected `kind`.
- For `must: not_exist` - All alternative must be absent.

> [!NOTE]
> Brace expansion is not glob matching. Wildcard patterns such as `src/**/*.ts` are not supported.

The examples above are individual rule definitions intended to be placed under the `rules` property.

## Path resolution

Structure rule paths are always resolved relative to the audited project's root directory, regardless of the configuration file's location.

Paths must resolve within the audited project directory.

**Examples:**

| Path                       | Result                                   |
| -------------------------- | ---------------------------------------- |
| `src/index.ts`             | Allowed                                  |
| `src/../README.md`         | Allowed if resolved within the project   |
| `../other-project/file.ts` | Rejected if resolved outside the project |

Absolute paths are also permitted, provided they resolve within the audited project directory.

**Security considerations**

Shapit prevents lexical path traversal outside the project root. However, this is not a complete filesystem security boundary: symbolic links may resolve to targets outside the audited project.

## Exit codes

Shapit uses exit codes to distinguish successful audits, rule violations, and execution errors.

| Code | Name           | Meaning                                      |
| ---: | -------------- | -------------------------------------------- |
|  `0` | `SUCCESS`      | Audit completed and all rules passed         |
|  `1` | `AUDIT_FAILED` | Audit completed but at least one rule failed |
|  `2` | `ERROR`        | Shapit could not complete the command        |

Execution errors include:

- Missing configuration files
- Invalid YAML
- Invalid Shapit configuration
- Invalid rule parameters
- Unsupported rule types
- Unexpected runtime errors

**Rule violations are not application errors.** They are expected audit results indicating that a project does not meet its configured standards.

## CI

A normal CI step is enough:

```yaml
- name: Audit project structure
  run: npx shapit audit
```

Shapit returns a non-zero exit code when an audit fails or an execution error occurs, allowing CI pipelines to detect violations automatically.

> Shapit must be installed as a project dependency before running this step. The example assumes the CI workflow has already installed dependencies.

## Programmatic API

Shapit also provides a programmatic API for loading configurations and auditing projects independently of the CLI.

### Public exports

**Functions**

| Function       | Description                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `loadConfig()` | Loads and validates a YAML configuration, returning the parsed configuration and any warnings. |
| `audit()`      | Executes configured rules against a project and returns audit results.                         |

**Types**

Shapit exports TypeScript types including `ShapitConfig`, `LoadedConfig`, `RuleDefinition`, `ProjectContext`, `RuleResult`, and `AuditResult`.

**Error handling**

`AppError` and `ErrorCodes` are also exported for handling configuration and execution errors.

### Usage

```ts
import { loadConfig, audit } from 'shapit'

const { config, warnings } = await loadConfig('./shapit.yml')

const results = await audit(config, {
  cwd: process.cwd(),
})

// Check audit results
const failed = results.filter((result) => !result.valid)

console.log({
  total: results.length,
  passed: results.length - failed.length,
  failed: failed.length,
  warnings,
})
```

The configuration path passed to `loadConfig()` is resolved independently of the project root passed to `audit()`.

### API behavior

- `loadConfig()` validates the configuration and returns any non-blocking warnings.
- `audit()` expects a validated `ShapitConfig` and returns an array of `AuditResult`.
- Rule violations are represented by results with `valid: false`, not thrown exceptions.
- Configuration and execution errors may throw an `AppError`.
- The programmatic API does not set process exit codes or render CLI output.

> **Stability:** The programmatic API is publicly available but may evolve during the `0.x` release series.
