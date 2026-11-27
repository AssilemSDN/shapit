# JSON source

The `json` source reads a JSON file and selects values using JSONPath. Each selected value creates an instance of a [dynamic rule](../configuration.md#dynamic-rules).

## Properties

| Property | Required | Description                                            |
| -------- | -------- | ------------------------------------------------------ |
| `type`   | Yes      | Must be `json`.                                        |
| `file`   | Yes      | Path relative to the project root. Cannot escape it.   |
| `select` | Yes      | JSONPath expression used to select values.             |
| `as`     | No       | Variable name for interpolation. Defaults to `source`. |

Unknown properties are rejected.

## Selection

Each selected value creates a separate rule instance.

Selected values can be scalars, objects, or arrays. However, interpolation only supports scalar values (`string`, `number`, or `boolean`).

For objects, individual properties can be accessed using dot notation (e.g., `{{ source.name }}`).

| Expression      | Selects              |
| --------------- | -------------------- |
| `$.main`        | The `main` field     |
| `$.files[*]`    | Each item in `files` |
| `$.scripts.*`   | Each script value    |
| `$.packages[*]` | Each package object  |

See [jsonpathly](https://www.npmjs.com/package/jsonpathly) for supported syntax.

## Symbolic links

JSON sources follow symbolic links to read their target files.

The resolved path must remain inside the project root.

| Symbolic link                          | Behavior                |
| -------------------------------------- | ----------------------- |
| Internal, pointing to a JSON file      | Allowed                 |
| External, pointing outside the project | Rejected                |
| Broken                                 | Source resolution error |
| Cyclic                                 | Source resolution error |

Symbolic links in parent directories are also resolved and checked to prevent access outside the project.

Unlike the [structure rule](../rules/structure.md), which inspects filesystem entries without following the final symbolic link, JSON sources resolve symbolic links to read their contents.

## Examples

### Check published files

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

> [!WARNING]
> The `files` field may contain glob patterns or negations, which the [structure rule](../rules/structure.md) does not support.

### Check the entry point

```yaml
- id: package-entrypoint
  type: structure
  source:
    type: json
    file: package.json
    select: '$.main'
    as: entrypoint
  parameters:
    path: '{{ entrypoint }}'
    kind: file
    must: exist
```

### Use a value within a path

```yaml
- id: workspace-readmes
  type: structure
  source:
    type: json
    file: package.json
    select: '$.workspaces[*]'
    as: workspace
  parameters:
    path: '{{ workspace }}/README.md'
    kind: file
```

## Errors

Source resolution errors stop the audit with exit code `2`:

- `SOURCE_RESOLUTION_ERROR`: Missing, unreadable or invalid JSON file, including broken or cyclic symbolic links.
- `PATH_OUTSIDE_BASE_DIRECTORY`: File path escapes the project root, including through symbolic links.

An empty selection fails the rule (`valid: false`) without interrupting the audit. The audit exits with code `1` if any rule fails.
