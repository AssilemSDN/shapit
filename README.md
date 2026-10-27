<div align="center">
  <img
    src="https://raw.githubusercontent.com/AssilemSDN/shapit/main/docs/images/shapit.png"
    alt="Shapit banner"
    width="900"
  />
</div>

<br />

<div align="center">

[![CI](https://github.com/AssilemSDN/shapit/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AssilemSDN/shapit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/AssilemSDN/shapit/graph/badge.svg?token=IBG74CEDTK)](https://codecov.io/github/AssilemSDN/shapit)
[![npm](https://img.shields.io/npm/v/@bloup/shapit)](https://www.npmjs.com/package/@bloup/shapit)
![Node.js](https://img.shields.io/badge/Node.js-22%20%7C%2024%20%7C%2026-339933?logo=node.js&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

# Shapit

> **Define your project's rules. Let Shapit check them.**

**Shapit** is a lightweight, declarative CLI for auditing projects against configurable standards.

Define your project conventions in YAML, run an audit, and get clear feedback on whether your project meets its requirements.

> [!WARNING]
> Shapit is under active development. Its configuration format and public API may change before v1.0.0.

## Quick start

Create a `shapit.yml` file in your project root:

```yaml
version: 1

rules:
  - id: readme
    type: structure
    parameters:
      path: README.{md,txt}
      kind: file
```

Run Shapit without adding it to your project dependencies:

```bash
npx @bloup/shapit audit
```

Or install it locally:

```bash
npm install -D @bloup/shapit
```

Then run:

```bash
npx shapit audit
```

## Features

- **Declarative configuration** - Define project standards in YAML.
- **Structure validation** - Check required and forbidden files, directories, and path alternatives.
- **Dynamic rules** - Generate rule instances from external data sources.
- **CLI & API** - Run audits from the terminal or programmatically.
- **CI-ready** - Predictable exit codes for automated checks.

### Dynamic rules

Use external data sources to generate multiple instances of a rule.

For example, check the files declared in `package.json`:

```yaml
- id: package-files
  type: structure
  source:
    type: json
    file: package.json
    select: '$.files[*]'
    as: file
  parameters:
    path: '{{ file }}'
    must: exist
```

Each selected value generates an independent instance of the rule.

> [!NOTE]
> The `structure` rule supports exact paths and brace alternatives, but not glob patterns.

## CLI

```text
shapit <command> [options]
```

With Shapit installed locally:

```bash
# Audit the current directory
npx shapit audit

# Audit another project
npx shapit audit ../my-project

# Use a custom configuration
npx shapit audit --config config/shapit.yml

# Enable debug logging
npx shapit --debug audit
```

Without a local installation, use `npx @bloup/shapit` instead.

| Exit code | Meaning                          |
| --------- | -------------------------------- |
| `0`       | Command succeeded                |
| `1`       | Audit completed with violations  |
| `2`       | Configuration or execution error |

For detailed usage, see the [CLI documentation](https://github.com/AssilemSDN/shapit/blob/main/docs/usage.md).

## Documentation

- [Usage & CLI](https://github.com/AssilemSDN/shapit/blob/main/docs/usage.md)
- [Configuration](https://github.com/Assilem)
