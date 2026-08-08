import { createRequire } from "node:module";

import { Command } from "commander";

import { registerCommands } from "./commands.js";
import { applyGlobalOptions, registerGlobalOptions } from "./options.js";

interface PackageJson {
  version: string;
}

const require = createRequire(import.meta.url);

const packageJson = require("../../package.json") as PackageJson;

const program = new Command();

program
  .name("shapit")
  .description("Audit the expected shape of your projects")
  .version(packageJson.version);

registerGlobalOptions(program);
registerCommands(program);

program.hook("preAction", () => {
  applyGlobalOptions(program);
});

await program.parseAsync();
