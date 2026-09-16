import { createRequire } from 'node:module'

import { Command, CommanderError } from 'commander'

import { registerCommands } from './commands.js'
import { applyGlobalOptions, registerGlobalOptions } from './options.js'
import { ExitCodes } from '../utils/exit-codes.js'

interface PackageJson {
  version: string
}

const require = createRequire(import.meta.url)

const packageJson = require('../../package.json') as PackageJson

const program = new Command()

program
  .name('shapit')
  .description('Audit the expected shape of your projects')
  .version(packageJson.version)

registerGlobalOptions(program)
registerCommands(program)

program.hook('preAction', () => {
  applyGlobalOptions(program)
})

program.exitOverride()


try {
  await program.parseAsync()
} catch (error: unknown) {
  if (error instanceof CommanderError) {
    process.exitCode =
      error.exitCode === 0
        ? ExitCodes.SUCCESS.code
        : ExitCodes.ERROR.code
  } else {
    throw error
  }
}