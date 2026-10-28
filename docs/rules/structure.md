# `structure` rule

The `structure` rule checks whether files and directories exist within a project, optionally enforcing their type.

## Parameters

| Parameter | Required | Default | Description                                   |
| --------- | -------- | ------- | --------------------------------------------- |
| `path`    | Yes      | —       | Path to check. Supports brace alternatives.   |
| `kind`    | No       | `any`   | Expected type: `file`, `directory`, or `any`. |
| `must`    | No       | `exist` | Either `exist` or `not_exist`.                |

Unknown parameters are rejected. `kind` is ignored when `must` is `not_exist`.

## Examples

### Required file

```yaml
- id: package-json
  type: structure
  parameters:
    path: package.json
    kind: file
```

### Forbidden file

```yaml
- id: no-env
  type: structure
  parameters:
    path: .env
    must: not_exist
```

### Alternative paths

```yaml
- id: readme
  type: structure
  parameters:
    path: README.{md,txt}
    kind: file
```

Brace alternatives follow these rules:

- `must: exist`: at least one alternative must match.
- `must: not_exist`: all alternatives must be absent.

> [!NOTE]
> Brace expansion is not glob matching. Wildcards such as `src/**/*.ts` are not supported.

## Dynamic usage

The `path` parameter supports [placeholders](../configuration.md#placeholders) when used with a [source](../sources/json.md):

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

Each generated instance follows the same validation and path restrictions as a static rule.

## Path resolution

Paths are resolved relative to the audited project root, regardless of the configuration file's location.

- Relative and absolute paths are allowed within the project.
- Paths resolving outside the project are rejected.
- Symbolic links may point outside the project; path validation is not a complete filesystem security boundary.

## Result messages

| Outcome | Example                             |
| ------- | ----------------------------------- |
| Pass    | `Matching file found: "LICENSE"`    |
| Pass    | `Expected paths are absent: ".env"` |
| Fail    | `Unexpected path found: ".env"`     |
