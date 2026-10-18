<div align="center">
  <img
    src="https://raw.githubusercontent.com/AssilemSDN/shapit/main/docs/images/shapit.png"
    alt="shapit banner"
    width="900"
  />
</div>

<br />

<div align="center">

[![CI](https://github.com/AssilemSDN/shapit/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AssilemSDN/shapit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/AssilemSDN/shapit/graph/badge.svg?token=IBG74CEDTK)](https://codecov.io/github/AssilemSDN/shapit)
![Node.js](https://img.shields.io/badge/Node.js-22%20%7C%2024%20%7C%2026-339933?logo=node.js&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-4.18.1-2C8EBB?logo=yarn&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

# Shapit

> **Define your project's rules. Let Shapit check them.**

**Shapit** is a lightweight, declarative CLI for auditing projects against configurable rules.

Define your project conventions in a YAML file, run an audit, and get clear feedback on whether your project meets your standards.

Built around an extensible rule system, Shapit is designed to validate differents aspects of a project through dedicated rule types.

> [!WARNING]
> Shapit is under active development. Its configuration format and public API may change before a stable release.

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

Then run Shapit directly with npx:

```bash
npx shapit audit
```

Or install it as a development dependency:

```bash
npm install --save-dev shapit
```

> Shapit evaluates the configured rules and reports whether your project satisfies them.

## Features

Shapit currently provides:

- **Declarative configuration** - Define project requirements using YAML;
- **Extensible rule system** - Support for dedicated rule types
- **CLI & API** - Run audits from the terminal or programmatically
- **CI-ready** - Structured results and predictable exit codes

### Available rule types

|        Type | Description                                                                             |
| ----------: | --------------------------------------------------------------------------------------- |
| `structure` | Validate required and forbidden paths, file and directory types, and path alternatives. |

> Additional rule types are planned for future releases.

## CLI

```text
npx shapit audit [project-dir] [options]
```

Common examples:

```bash
# Audit the current directory using shapit.yml
npx shapit audit

# Audit another project
npx shapit audit ../my-project

# Use another configuration file
npx shapit audit --config config/shapit.yml

# Enable debug output
npx shapit --debug audit
```

Configuration files can be located outside the audited project. Rule paths are resolved relative to the audited project's root directory.

For detailed usage and options, see the [documentation](https://github.com/AssilemSDN/shapit/blob/main/docs/usage.md)

## Programmatic API

Shapit can also be used programmatically:

```ts
import { audit, loadConfig } from 'shapit'

const { config, warnings } = await loadConfig('./shapit.yml')

const results = await audit(config, {
  cwd: process.cwd(),
})
```

The API provides structured audit results and configuration warnings without relying on CLI output.

## Exit codes

| Code | Meaning                         |
| ---: | ------------------------------- |
|  `0` | Audit passed                    |
|  `1` | Audit completed with violations |
|  `2` | Execution error                 |

## Requirements

- Node.js `>= 22.12.0`
- Yarn `4.x` for repository development

## License

MIT
