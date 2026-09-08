/*
  PATH /src/cli/options.ts
*/
import { Option } from 'commander'
import type { Command } from 'commander'

import { logger } from '../utils/logger.js'

interface GlobalOptions {
  debug?: boolean
  quiet?: boolean
}

export function registerGlobalOptions(program: Command): void {
  program
    .addOption(new Option('--debug', 'Enable debug logging').conflicts('quiet'))
    .addOption(new Option('--quiet', 'Only display errors').conflicts('debug'))
}

export function applyGlobalOptions(program: Command): void {
  const options = program.opts<GlobalOptions>()

  if (options.debug) {
    logger.level = 'debug'
  } else if (options.quiet) {
    logger.level = 'error'
  } else {
    logger.level = 'info'
  }

  logger.debug('Logger level:', logger.level)
}
