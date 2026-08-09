import { readFile } from "node:fs/promises";

import YAML from "yaml";

import { shapitConfigSchema } from "./schema.js";
import type { ShapitConfig } from "./types.js";

import { AppError } from "../errors/AppError.js";

/**
 * Loads and parses the Shapit configuration file from the specified path.
 *
 * @param path
 * @returns A promise that resolves to the parsed Shapit configuration.
 */
export const loadConfig = async (path: string): Promise<ShapitConfig> => {
  let content: string;

  try {
    content = await readFile(path, "utf8");
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "code" in err &&
      err.code === "ENOENT"
    ) {
      throw new AppError(`Configuration file not found: "${path}"`, {
        code: "CONFIG_NOT_FOUND",
        details: { path },
      });
    }

    throw err;
  }

  let rawConfig: unknown;

  try {
    rawConfig = YAML.parse(content);
  } catch (err: unknown) {
    throw new AppError(`Invalid YAML in configuration file "${path}"`, {
      code: "INVALID_YAML",
      details: err,
    });
  }

  const result = shapitConfigSchema.safeParse(rawConfig);

  if (!result.success) {
    throw new AppError(`Invalid Shapit configuration in "${path}"`, {
      code: "INVALID_CONFIG",
      details: result.error.issues,
    });
  }

  return result.data;
};
