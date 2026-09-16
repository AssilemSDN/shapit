# Shapit

> Define your project's expected shape. Let Shapit check it.

**Shapit** is a lightweight and declarative CLI to audit the expected shape of a project.

Define project constraints in a YAML configuration file, run an audit, and let Shapit verify that the project matches the expected shape.

> [!WARNING]
> Shapit is under active development. The configuration format and public API may change before a stable release.

## Quick start

Create a `shapit.yml` file:

```yaml
rules:
  - id: package-json
    type: structure
    description: 'package.json must exist in the project root'
    parameters:
      path: package.json
      path_type: file
      required: true

  - id: source-directory
    type: structure
    description: 'src must be a directory'
    parameters:
      path: src
      path_type: directory
      required: true
```

Then run the audit:

```bash
shapit audit
```

## What Shapit does

Shapit currently provides:

- declarative project auditing with YAML;
- strict configuration validation;
- required and optional filesystem paths;
- file and directory type checks;
- allowed file extension checks;
- human-readable audit output;
- debug and quiet logging modes;
- deterministic CI-friendly exit codes;
- an extensible rule architecture.

The currently implemented rule type is `structure`.

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

## Programmatic API

Shapit can also be used programmatically:

```ts
import { audit, loadConfig } from 'shapit'

const config = await loadConfig('./shapit.yml')
const results = await audit(config, {
  cwd: process.cwd(),
})
```

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
