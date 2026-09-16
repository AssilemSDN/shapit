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

| Option | Description |
| --- | --- |
| `-V, --version` | Display the installed version |
| `--debug` | Enable debug logging |
| `--quiet` | Only display errors |
| `-h, --help` | Display help |

`--debug` and `--quiet` cannot be used together.

## Configuration

The default configuration file is:

```text
shapit.yml
```

Current root format:

```yaml
rules:
  - id: package-json
    type: structure
    description: package.json must exist
    parameters:
      path: package.json
      path_type: file
```

Each rule contains:

| Property | Required | Description |
| --- | --- | --- |
| `id` | Yes | Rule identifier |
| `type` | Yes | Rule executor |
| `description` | No | Human-readable description |
| `parameters` | Yes | Rule-specific parameters |

The root configuration is strict. Unknown root properties are rejected.

## `structure` rule

The `structure` rule validates paths relative to the audited project.

Parameters:

| Parameter | Required | Default | Description |
| --- | --- | --- | --- |
| `path` | Yes | — | Relative project path |
| `path_type` | Yes | — | `file` or `directory` |
| `file_extension` | No | — | Allowed file extensions |
| `required` | No | `true` | Whether the path must exist |

### Required file

```yaml
rules:
  - id: package-json
    type: structure
    parameters:
      path: package.json
      path_type: file
```

### Optional file

```yaml
rules:
  - id: environment-file
    type: structure
    parameters:
      path: .env
      path_type: file
      required: false
```

### File extensions

```yaml
rules:
  - id: config-file
    type: structure
    parameters:
      path: config.yaml
      path_type: file
      file_extension:
        - .yaml
        - .yml
```

## Exit codes

| Code | Name | Meaning |
| ---: | --- | --- |
| `0` | `SUCCESS` | Audit completed and all rules passed |
| `1` | `AUDIT_FAILED` | Audit completed but at least one rule failed |
| `2` | `ERROR` | Shapit could not complete the command |

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

Shapit currently exposes source-level entry points for:

```ts
loadConfig
audit
```

and types such as:

```ts
ProjectContext
RuleResult
AuditResult
```

The programmatic API is still unstable and the package export contract may change before a stable release.

Conceptually:

```ts
const config = await loadConfig('./shapit.yml')

const results = await audit(config, {
  cwd: process.cwd(),
})
```
