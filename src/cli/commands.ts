/*
  PATH /src/cli/commands.ts
*/
import type { Command } from 'commander'

import { auditProject } from '../commands/audit-project.js'
import { runCommand } from './command-runner.js'
import { renderAuditResult } from './renderer/render-audit-result.js'
import { initProject } from '../commands/init-config.js'
import { renderInitResult } from './renderer/render-init-result.js'

export function registerCommands(program: Command): void {
  program
    .command('init')
    .description('Create a starter shapit.yml configuration')
    .argument('[project-dir]', 'Project directory to initialize', '.')
    .action(async (projectDir: string) => {
      await runCommand({
        commandName: 'project initialization',
        commandFn: initProject,
        options: { projectDir },
        renderData: renderInitResult,
      })
    })
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
        renderData: renderAuditResult,
      })
    })
}
