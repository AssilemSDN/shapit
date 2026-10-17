<div align="center">
  <img
    src="./docs/images/shapit.png"
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

> Define your project's expected shape. Let Shapit check it.

**Shapit** is a lightweight and declarative CLI to audit the expected shape of a project.

Define project constraints in a YAML configuration file, run an audit, and let Shapit verify that the project matches the expected shape.

> [!WARNING]
> Shapit is under active development. The configuration format and public API may change before a stable release.

## Quick start

Create a `shapit.yml` file:

```yaml
version: 1

rules:
  - id: package-json
    type: structure
    description: 'package.json must exist in the project root'
    parameters:
      path: package.json
      kind: file

  - id: source-directory
    type: structure
    description: 'src must be a directory'
    parameters:
      path: src
      kind: directory

  - id: readme
    type: structure
    description: 'A README file must exist'
    parameters:
      path: README.{md,txt}
      kind: file

  - id: no-env
    type: structure
    description: 'The .env file must not exist'
    parameters:
      path: .env
      must: not_exist
```

Then run the audit:

```bash
shapit audit
```

Shapit evaluates the configured rules and reports whether your project satisfies them.

## What Shapit does

Shapit currently provides:

- declarative project auditing with YAML;
- versioned and strictly validated configuration;
- required and forbidden filesystem paths;
- file and directory type checks;
- alternative paths using brace expansion;
- human-readable audit results and diagnostics;
- debug and quiet logging modes;
- deterministic CI-friendly exit codes;
- an extensible, modular rule architecture.

The currently implemented rule type is `structure`. Additional rule types are planned for future releases.

## CLI

```text
shapit audit [project-dir] [options]
```

Common examples:

```bash
# Audit the current directory using shapit.yml
shapit audit

# Audit another project
shapit audit ../my-project

# Use another configuration file
shapit audit --config config/shapit.yml

# Enable debug output
shapit --debug audit
```

Configuration files can be located outside the audited project. Rule paths are resolved relative to the audited project's root directory.

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

## Documentation

- [Usage & configuration](docs/usage.md)

## Requirements

- Node.js `>= 22.12.0`
- Yarn `4.x` for repository development

## License

MIT
