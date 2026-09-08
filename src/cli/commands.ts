/*
  PATH /src/cli/commands.ts
*/
import type { Command } from 'commander'

import { auditProject } from '../commands/audit-project.js'
import { runCommand } from '../utils/command-runner.js'

export function registerCommands(program: Command): void {
  program
    .command('audit')
    .description('Audit a project using its Shapit configuration')
    .argument('[project-dir]', 'Project directory to audit', '.')
    .option('-c, --config <file>', 'Path to the Shapit configuration file', 'shapit.yml')
    .action(async (projectDir: string, options: { config: string }) => {
      await runCommand('project audit', auditProject, {
        projectDir,
        configFile: options.config,
      })
    })
}
