/*
  PATH /src/cli/commands.ts
*/
import type { Command } from 'commander'

import { auditProject } from '../commands/audit-project.js'
import { runCommand } from './command-runner.js'
import { renderAuditResult } from './renderer/render-audit-result.js'
import { initConfig } from '../commands/init-config.js'
import { renderInitResult } from './renderer/render-init-result.js'

export function registerCommands(program: Command): void {
  program
    .command('init')
    .description('Create a starter shapit.yml configuration')
    .argument('[project-dir]', 'Project directory to initialize', '.')
    .option('-c, --config <file>', 'Configuration file to create', 'shapit.yml')
    .action(async (projectDir: string, options: { config: string }) => {
      await runCommand({
        commandName: 'project initialization',
        commandFn: initConfig,
        options: {
          projectDir,
          configFileName: options.config,
        },
        renderData: renderInitResult,
        showCompletionMessage: false,
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
