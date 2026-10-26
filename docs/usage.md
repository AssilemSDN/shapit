# Usage

Shapit's command-line interface, exit codes, and CI integration.

- [Configuration](./configuration.md) — Configuration format and dynamic rules
- [Rules](./rules/structure.md) — Available rule types
- [Sources](./sources/json.md) — Data sources for dynamic rules
- [Programmatic API](./api.md)

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

## Options

| Option                | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `project-dir`         | Directory to audit. Defaults to the current directory.                      |
| `-c, --config <path>` | Configuration file, relative to the project root. Defaults to `shapit.yml`. |
| `-V, --version`       | Display the installed version.                                              |
| `--debug`             | Enable debug logging.                                                       |
| `--quiet`             | Only display errors.                                                        |
| `-h, --help`          | Display help.                                                               |

`--debug` and `--quiet` cannot be used together.

The configuration file may be located outside the audited project. Rule paths always resolve relative to the project root.

## Output

Each rule reports its result. [Dynamic rules](./configuration.md#dynamic-rules) display their generated instances as a group.

```text
✔ license: Matching file found: "LICENSE"
ℹ package-files (2 instances)
  ✔ #0: Matching path found: "dist"
  ✔ #1: Matching path found: "bin"
ℹ Audit summary: 3 passed, 0 failed (3 total).
```

The summary counts instances rather than rule definitions.

## Exit codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| `0`  | All rules passed                 |
| `1`  | One or more rules failed         |
| `2`  | Configuration or execution error |

Rule failures indicate non-compliance, not application errors. An empty source selection also produces a rule failure (`1`), while source resolution and interpolation errors return `2`.

## CI integration

Add Shapit to your CI pipeline after installing project dependencies:

```yaml
- name: Audit project
  run: npx shapit audit
```

A non-zero exit code causes the CI step to fail.
