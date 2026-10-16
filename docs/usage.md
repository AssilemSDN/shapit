# Usage & configuration

This document contains the user-facing Shapit reference.

## Run an audit

```bash
shapit audit [project-dir] [options]
```

By default:

- the current directory is audited;
- Shapit loads `shapit.yml` from that directory.

Examples:

```bash
shapit audit
shapit audit ../my-project
shapit audit --config config/shapit.yml
shapit audit ../my-project --config .config/shapit.yml
```

The configuration path is resolved relative to the audited project.

## Global options

| Option          | Description                   |
| --------------- | ----------------------------- |
| `-V, --version` | Display the installed version |
| `--debug`       | Enable debug logging          |
| `--quiet`       | Only display errors           |
| `-h, --help`    | Display help                  |

`--debug` and `--quiet` cannot be used together.

## Audit options

| Argument / Option     | Description                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `project-dir`         | Directory to audit. Defaults to the current working directory.                                   |
| `-c, --config <path>` | Configuration file to load, relative to the audited project directory. Defaults to `shapit.yml`. |

The configuration file can be located outside the audited project by providing an appropriate relative or absolute path. Rule paths remain relative to the audited project root.

## Configuration

Shapit uses a YAML configuration file named `shapit.yml` by default.

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
| `rules`   | Yes      | Array of rule definitions.                                                 |

### Rule properties

| Property      | Required | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `id`          | Yes      | Unique, non-empty rule identifier.                   |
| `type`        | Yes      | Rule type. Currently, only `structure` is supported. |
| `description` | No       | Human-readable description of the rule.              |
| `parameters`  | No       | Parameters specific to the rule type.                |

Unknown configuration and rule properties are rejected. Rule parameters are validated separately according to their type.

Rule identifiers must be unique within a configuration.

## `structure` rule

The `structure` rule checks filesystem path existence and, when existence is required, validates the expected path type.

### Parameters

| Parameter | Required | Default | Description                                                |
| --------- | -------- | ------- | ---------------------------------------------------------- |
| `path`    | Yes      | —       | Path to inspect, optionally containing brace alternatives. |
| `kind`    | No       | `any`   | Expected path type: `file`, `directory`, or `any`.         |
| `must`    | No       | `exist` | Existence requirement: `exist` or `not_exist`.             |

> The `kind` parameter only applies when `must` is `exist`. When `must` is `not_exist`, any existing path violates the rule, regardless of its type.

### Required paths

> The following examples are individual rule definitions intended to be placed under the rules property.

```yaml
- id: package-json
  type: structure
  parameters:
    path: package.json
    kind: file
```

The audit passes when `package.json` exists and is a file.

### Forbidden paths

```yaml
- id: no-env
  type: structure
  parameters:
    path: .env
    must: not_exist
```

The audit passes only when `.env` is absent.

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

For `must: exist`, at least one alternative must exist and match the expected `kind`.

For `must: not_exist`, every alternative must be absent.

Brace expansion is not the same as glob matching. Patterns such as `src/**/*.ts` are not supported as wildcard searches.

## Path resolution

Structure rule paths are resolved relative to the audited project's root directory, independently of the configuration file's location.

Paths must resolve inside the audited project directory.

Examples:

- `src/index.ts` — allowed.
- `src/../README.md` — allowed if it resolves inside the project.
- `../other-project/file.ts` — rejected if it resolves outside the project.

Absolute paths are permitted only when they resolve inside the project directory.

Path containment prevents lexical traversal outside the project root but does not provide a complete filesystem security boundary. Symbolic links may resolve to targets outside the audited project.

## Exit codes

| Code | Name           | Meaning                                      |
| ---: | -------------- | -------------------------------------------- |
|  `0` | `SUCCESS`      | Audit completed and all rules passed         |
|  `1` | `AUDIT_FAILED` | Audit completed but at least one rule failed |
|  `2` | `ERROR`        | Shapit could not complete the command        |

Examples of execution errors:

- missing configuration file;
- invalid YAML;
- invalid Shapit configuration;
- invalid rule parameters;
- unknown rule type;
- unexpected runtime error.

An audit violation is not an application error. It is a normal audit result.

## CI

A normal CI step is enough:

```yaml
- name: Audit project shape
  run: yarn shapit audit
```

Any audit violation or execution error returns a non-zero exit code.

## Programmatic API

Shapit provides a programmatic API for loading configurations and auditing projects independently of the CLI.

### Exports

The following functions are available:

- `loadConfig()` - Loads and validates a YAML configuration, returning the parsed configuration and any warnings.
- `audit()` - Executes the configured rules against a project and returns their results.

The configuration file path passed to `loadConfig()` is resolved independently of the project root passed to `audit()`.

Shapit also exports types including `ShapitConfig`, `LoadedConfig`, `RuleDefinition`, `ProjectContext`, `RuleResult`, and `AuditResult`, as well as `AppError` and `ErrorCodes` for error handling.

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

### Behavior

- `loadConfig()` validates the configuration and returns any non-blocking warnings.
- `audit()` expects a validated `ShapitConfig` and returns an array of `AuditResult`.
- Rule violations are represented by results with `valid: false`, not thrown exceptions.
- Configuration and execution errors may throw an `AppError`.
- The programmatic API does not set process exit codes or render CLI output.

**Note:** The programmatic API is available through the package's public exports but remains subject to change during the `0.x` release series.
