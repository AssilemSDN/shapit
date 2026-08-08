import { readFile } from "node:fs/promises";

import YAML from "yaml";

import { shapitConfigSchema } from "./schema.js";
import type { ShapitConfig } from "./types.js";

/**
 * Loads and parses the Shapit configuration file from the specified path.
 *
 * @param path
 * @returns A promise that resolves to the parsed Shapit configuration.
 */
export const loadConfig = async (path: string): Promise<ShapitConfig> => {
  const content = await readFile(path, "utf8");
  const rawConfig: any = YAML.parse(content);

  return shapitConfigSchema.parse(rawConfig);
};
