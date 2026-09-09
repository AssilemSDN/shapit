/*
  PATH /src/cli/commands.ts
*/
import type { Command } from 'commander'

import { auditProject } from '../commands/audit-project.js'
import { runCommand } from '../utils/command-runner.js'
import { renderAuditResult } from './renderer/render-audit-result.js'

export function registerCommands(program: Command): void {
  program
    .command('audit')
    .description('Audit a project using its Shapit configuration')
    .argument('[project-dir]', 'Project directory to audit', '.')
    .option('-c, --config <file>', 'Path to the Shapit configuration file', 'shapit.yml')
    .action(async (projectDir: string, options: { config: string }) => {
      await runCommand({
        commandName: 'project audit',
        commandFn: auditProject,
        options: {
          projectDir,
          configFile: options.config,
        },
        renderData: ({ results }) => {
          renderAuditResult(results)
        },
      })
    })
}
