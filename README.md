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
      path: README.md
      kind: file
```

Run Shapit without adding it to your project dependencies:

```bash
npx @bloup/shapit audit
```

Or install it locally as a development dependency:

```bash
npm install -D @bloup/shapit
```

Then run the installed CLI:

```bash
npx shapit audit
```

Shapit evaluates your project against the configured rules and reports the results.

## Features

- **Declarative configuration** — Define project standards in YAML.
- **Structure validation** — Check required and forbidden files, directories and path alternatives.
- **Extensible rule system** — Built to support additional rule types.
- **CLI & API** — Run audits from the terminal or programmatically.
- **CI-ready** — Predictable exit codes for automated checks.

## CLI

```text
shapit audit [project-dir] [options]
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

For detailed options, see the [CLI documentation](https://github.com/AssilemSDN/shapit/blob/main/docs/usage.md).

## Programmatic API

Shapit can also be used programmatically:

```ts
import { audit, loadConfig } from '@bloup/shapit'

const { config, warnings } = await loadConfig('./shapit.yml')
const results = await audit(config, { cwd: process.cwd() })
```

The API returns structured audit results and configuration warnings without relying on CLI output.

## Exit codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| `0`  | All rules passed                 |
| `1`  | One or more rules failed         |
| `2`  | Configuration or execution error |

## Requirements

- Node.js >= 22.12.0
- Yarn 4.x for repository development

## License

[MIT](./LICENSE)
