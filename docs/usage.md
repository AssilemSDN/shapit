# Usage

Learn how to initialize projects, run audits, and integrate Shapit into CI pipelines.

- [Configuration](./configuration.md) — Configuration format and dynamic rules
- [Rules](./rules/structure.md) — Available rule types
- [Sources](./sources/json.md) — Data sources for dynamic rules
- [Programmatic API](./api.md)

## Initialize a project

```bash
shapit init [project-dir] [options]
```

Generate a starter `shapit.yml` configuration file in the specified project directory.

By default, Shapit uses the current directory and asks for confirmation before creating the file.

```bash
# Current directory
npx shapit init

# Another project
npx shapit init ../my-project

# Custom configuration filename
npx shapit init --config custom-shapit.yml
```

Shapit never overwrites an existing configuration file. The target directory must already exist.

The generated configuration can be customized before running an audit.

### Output

Shapit reports whether the configuration was created or the operation was cancelled.

```text
√ Create configuration file "/path/to/shapit.yml"? Yes
√ Created configuration file: "/path/to/shapit.yml"
```

```text
√ Create configuration file "/path/to/shapit.yml"? No
i Initialization cancelled.
```

### Exit codes

| Code | Meaning                            |
| ---- | ---------------------------------- |
| `0`  | Configuration created or cancelled |
| `2`  | Initialization error               |

## Run an audit

```bash
shapit audit [project-dir] [options]
```

By default, Shapit audits the current directory using its `shapit.yml` file.

```bash
# Current directory
npx shapit audit

# Another project
npx shapit audit ../my-project

# Custom configuration
npx shapit audit --config config/shapit.yml

# Both
npx shapit audit ../my-project --config .config/shapit.yml
```

The configuration file may be located outside the audited project. Rule paths always resolve relative to the project root.

### Output

Each rule reports its result. [Dynamic rules](./configuration.md#dynamic-rules) display their generated instances as a group.

```text
✔ license: Matching file found: "LICENSE"
ℹ package-files (2 instances)
  ✔ #0: Matching path found: "dist"
  ✔ #1: Matching path found: "bin"
ℹ Audit summary: 3 passed, 0 failed (3 total).
```

The summary counts instances rather than rule definitions.

### Exit codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| `0`  | All rules passed                 |
| `1`  | One or more rules failed         |
| `2`  | Configuration or execution error |

Rule failures indicate non-compliance, not application errors.

Source resolution and interpolation errors return `2`, including when a source produces no contexts.

### CI integration

Add Shapit to your CI pipeline after installing project dependencies:

```yaml
- name: Audit project
  run: npx shapit audit
```

A non-zero exit code causes the CI step to fail.

## Options

### Command options

| Option                 | `init` | `audit` | Description                                                        |
| ---------------------- | :----: | :-----: | ------------------------------------------------------------------ |
| `project-dir`          |   ✓    |    ✓    | Target project directory. Defaults to the current directory.       |
| `-c, --config <value>` |   ✓    |    ✓    | Configuration filename for `init`, configuration path for `audit`. |

For `init`, the configuration filename defaults to `shapit.yml` and must not contain directory separators.

For `audit`, the configuration path defaults to `shapit.yml` and is resolved relative to the project root.

### Global options

| Option          | Description                    |
| --------------- | ------------------------------ |
| `-V, --version` | Display the installed version. |
| `--debug`       | Enable debug logging.          |
| `--quiet`       | Only display errors.           |
| `-h, --help`    | Display help.                  |

`--debug` and `--quiet` cannot be used together.
