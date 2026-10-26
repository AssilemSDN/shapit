# Configuration

Shapit uses a YAML file (`shapit.yml` by default) to define project standards.

```yaml
version: 1

rules:
  - id: readme
    type: structure
    description: A README file must exist
    parameters:
      path: README.{md,txt}
      kind: file
```

## Properties

| Property  | Required | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `version` | No       | Configuration version. Defaults to `1` with a warning. |
| `rules`   | Yes      | List of rule definitions.                              |

### Rule properties

| Property      | Required | Description                                       |
| ------------- | -------- | ------------------------------------------------- |
| `id`          | Yes      | Unique, non-empty identifier. Cannot contain `#`. |
| `type`        | Yes      | Rule type. See [rules](./rules/structure.md).     |
| `description` | No       | Human-readable description.                       |
| `source`      | No       | Source for dynamic rules.                         |
| `parameters`  | Depends  | Rule-specific parameters.                         |

Unknown properties are rejected.

## Dynamic rules

A rule with a `source` generates one instance per selected value.

```yaml
- id: package-files
  type: structure
  source:
    type: json
    file: package.json
    select: '$.files[*]'
    as: publishedPath
  parameters:
    path: '{{ publishedPath }}'
    must: exist
```

Each selected value replaces `{{ publishedPath }}` in the rule parameters.

### Placeholders

Placeholders use `{{ name }}` syntax and must be quoted in YAML.

- Supported in strings, including nested parameters.
- Standalone placeholders preserve the value type; embedded placeholders produce strings.
- Unknown variables and malformed expressions cause errors.

Selected values must be strings, numbers or booleans.

### Instances

Each instance receives an identifier such as `package-files#0`, `package-files#1`, etc. The `#` character is reserved for this purpose.

An empty selection fails the rule without interrupting the audit.

See [JSON sources](./sources/json.md) and [dynamic rule output](./usage.md#output) for details.
