# Shapit

> Define your project's expected shape. Let Shapit check it.

**Shapit** is a lightweight and declarative CLI to audit the expected structure of a project.

Define project constraints in a YAML configuration file, run an audit, and let Shapit verify that the project matches the expected shape.

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

Then run:

```bash
yarn shapit audit
```

Shapit is designed to be simple to use locally and predictable enough to integrate directly into CI pipelines.

## Features

- Declarative project validation using `shapit.yml`
- Validate required files and directories
- Validate expected path types
- Validate allowed file extensions
- Optional and required paths
- Human-readable rule descriptions
- Strict configuration validation
- CI-friendly exit codes
- Debug and quiet logging modes
- Lightweight and extensible rule architecture

> ⚠️ **Work In Progress (WIP)**
> Shapit is currently in early development. The configuration format and internal APIs may change between releases.

## Table of contents

- [Shapit](#shapit)
  - [Features](#features)
  - [Table of contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
    - [For end users](#for-end-users)
    - [For contributors / developers](#for-contributors--developers)
  - [Installation](#installation)
    - [Project dependency](#project-dependency)
    - [One-off execution](#one-off-execution)
    - [For contributors](#for-contributors)
  - [Usage](#usage)
    - [Quick command summary](#quick-command-summary)
    - [Examples](#examples)
    - [Global options](#global-options)
    - [`audit`](#audit)
      - [Arguments](#arguments)
      - [Options](#options)
  - [Configuration](#configuration)
    - [Rule definition](#rule-definition)
  - [`structure` rule](#structure-rule)
    - [Parameters](#parameters)
    - [Required file](#required-file)
    - [Required directory](#required-directory)
    - [File extension](#file-extension)
    - [Optional path](#optional-path)
  - [Exit codes](#exit-codes)
  - [Development](#development)
    - [Development mode](#development-mode)
  - [License](#license)

## Prerequisites

### For end users

| Requirement | Version | Notes                   |
| ----------- | ------- | ----------------------- |
| Node.js     | >= 22   | Required to run the CLI |

If Shapit is installed in a Yarn project, Yarn 4 is recommended.

### For contributors / developers

| Requirement | Supported versions | Recommended     | Notes                                                 |
| ----------- | ------------------ | --------------- | ----------------------------------------------------- |
| Node.js     | >= 22              | 22              | Required to develop and run Shapit                    |
| Yarn        | 4.x                | 4.18.0          | Managed through Corepack and pinned in `package.json` |
| TypeScript  | Project version    | Project version | Installed through project dependencies                |

Enable Corepack before installing dependencies:

```bash
corepack enable
yarn --version
```

The reported Yarn version should match the version declared in the `packageManager` field of `package.json`.

## Installation

### Project dependency

Shapit is intended to be installed as a development dependency of the project it audits:

```bash
yarn add --dev shapit
```

Then run it through Yarn:

```bash
yarn shapit audit
```

### One-off execution

Shapit can also be executed without adding it permanently to the project:

```bash
yarn dlx shapit audit
```

### For contributors

Clone the repository and install dependencies using the pinned Yarn version:

```bash
git clone https://github.com/AssilemSDN/shapit.git
cd shapit

corepack enable
yarn install --immutable
```

This project uses Yarn 4.

Use Yarn to manage project dependencies and avoid running `npm install`, as doing so may create lockfile or dependency-management conflicts.

## Usage

```bash
shapit [options] [command]
```

When installed locally with Yarn:

```bash
yarn shapit [options] [command]
```

### Quick command summary

| Command                        | Description                                  |
| ------------------------------ | -------------------------------------------- |
| `shapit audit`                 | Audit the current project using `shapit.yml` |
| `shapit audit <project-dir>`   | Audit another project directory              |
| `shapit audit --config <file>` | Use a custom Shapit configuration file       |

### Examples

Audit the current directory:

```bash
yarn shapit audit
```

Audit another project:

```bash
yarn shapit audit ../my-project
```

Use a custom configuration file:

```bash
yarn shapit audit --config config/shapit.yml
```

Enable debug logs:

```bash
yarn shapit --debug audit
```

Only display errors:

```bash
yarn shapit --quiet audit
```

### Global options

| Option            | Description                                 |
| ----------------- | ------------------------------------------- |
| `-V`, `--version` | Show the CLI version                        |
| `--debug`         | Enable debug logging                        |
| `--quiet`         | Only display errors                         |
| `-h`, `--help`    | Show help for the CLI or a specific command |

`--debug` and `--quiet` cannot be used together.

### `audit`

Audit a project using its Shapit configuration.

```bash
yarn shapit audit [project-dir]
```

By default:

- the project directory is the current directory;
- the configuration file is `shapit.yml`.

#### Arguments

| Argument        | Required | Description                | Default |
| --------------- | -------- | -------------------------- | ------- |
| `[project-dir]` | No       | Project directory to audit | `.`     |

#### Options

| Option                | Description                           | Default      |
| --------------------- | ------------------------------------- | ------------ |
| `-c, --config <file>` | Path to the Shapit configuration file | `shapit.yml` |

Example:

```bash
shapit audit ./my-project --config .config/shapit.yml
```

## Configuration

Create a `shapit.yml` file at the root of the project:

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
    description: 'src must exist and must be a directory'
    parameters:
      path: src
      path_type: directory
      required: true
```

Unknown configuration properties are rejected.

### Rule definition

Every rule is defined using the following properties:

| Property      | Required | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| `id`          | Yes      | Technical identifier of the rule                    |
| `type`        | Yes      | Rule type to execute                                |
| `description` | No       | Human-readable description of what the rule expects |
| `parameters`  | Yes      | Parameters specific to the selected rule type       |

Example:

```yaml
- id: package-json
  type: structure
  description: 'package.json must exist in the project root'
  parameters:
    path: package.json
    path_type: file
```

The `id` identifies the rule, while `description` explains its intent to humans.

## `structure` rule

The `structure` rule validates the expected filesystem structure of a project.

It can check:

- whether a path exists;
- whether it is a file or directory;
- whether a file uses one of the expected extensions;
- whether the path is required.

### Parameters

| Parameter        | Type                | Required | Description                                     |
| ---------------- | ------------------- | -------- | ----------------------------------------------- |
| `path`           | `string`            | Yes      | Path to inspect                                 |
| `path_type`      | `file \| directory` | Yes      | Expected filesystem object type                 |
| `file_extension` | `string[]`          | No       | Allowed extensions when the path is a file      |
| `required`       | `boolean`           | No       | Whether the path must exist. Defaults to `true` |

### Required file

```yaml
rules:
  - id: package-json
    type: structure
    description: 'package.json must exist'
    parameters:
      path: package.json
      path_type: file
      required: true
```

### Required directory

```yaml
rules:
  - id: source-directory
    type: structure
    description: 'src must be a directory'
    parameters:
      path: src
      path_type: directory
      required: true
```

### File extension

```yaml
rules:
  - id: typescript-config
    type: structure
    description: 'TypeScript configuration must be a JSON file'
    parameters:
      path: tsconfig.json
      path_type: file
      file_extension:
        - .json
      required: true
```

### Optional path

```yaml
rules:
  - id: environment-file
    type: structure
    description: '.env may exist, but must be a file when present'
    parameters:
      path: .env
      path_type: file
      required: false
```

## Exit codes

Shapit uses deterministic exit codes so audits can be integrated directly into scripts and CI pipelines.

| Code | Name             | Description                                         |
| ---: | ---------------- | --------------------------------------------------- |
|  `0` | `SUCCESS`        | All rules passed                                    |
|  `1` | `AUDIT_FAILED`   | Audit completed but one or more rules were violated |
|  `2` | `USER_ERROR`     | Invalid configuration or user input                 |
|  `3` | `INTERNAL_ERROR` | Unexpected internal error                           |

Example CI usage:

```yaml
- name: Audit project structure
  run: yarn shapit audit
```

No additional shell logic is required: a failed audit already returns a non-zero exit code.

## Development

Clone and install the project:

```bash
git clone https://github.com/AssilemSDN/shapit.git
cd shapit

corepack enable
yarn install --immutable
```

### Development mode

Run the CLI directly from TypeScript sources:

```bash
yarn dev audit
```

You can also create a global symlink to the local package:

```bash
npm link
```

> Yarn 4's yarn link command does not create a global CLI link like Yarn Classic did. Use `npm link` to expose the local shapit executable.

Then run Shapit from anywhere:

```bash
# Audit using shapit.yml file by default
shapit audit

# Or specify path to shapit config file
shapit audit --config ./path/to/shapit/config

# Or specify the path to the project
shapit audit ./path/to/project --config ./path/to/shapit/config
```

## License

MIT
