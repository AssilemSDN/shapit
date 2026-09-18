/*
  PATH /src/utils/logger.ts
*/
import chalk from 'chalk'
import logSymbols from 'log-symbols'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface Logger {
  level: LogLevel
  log(level: LogLevel, ...args: unknown[]): void
  debug(...args: unknown[]): void
  info(...args: unknown[]): void
  success(...args: unknown[]): void
  warn(...args: unknown[]): void
  error(...args: unknown[]): void
}

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

function isLogLevel(value: string | undefined): value is LogLevel {
  return value !== undefined && value in LEVELS
}

const DEFAULT_LEVEL: LogLevel = isLogLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info'

export const logger: Logger = {
  level: DEFAULT_LEVEL,

  log(level: LogLevel, ...args: unknown[]): void {
    if (LEVELS[level] > LEVELS[this.level]) {
      return
    }
    if (level === 'debug') {
      const time = new Date().toISOString()
      console.error(chalk.gray(`[${time}] [DEBUG]`), ...args)
      return
    }
    if (level === 'warn' || level === 'error') {
      console.error(...args)
      return
    }
    console.log(...args)
  },

  debug(...args: unknown[]): void {
    this.log('debug', logSymbols.info, ...args)
  },

  info(...args: unknown[]): void {
    this.log('info', logSymbols.info, ...args)
  },

  success(...args: unknown[]): void {
    this.log('info', logSymbols.success, ...args)
  },

  warn(...args: unknown[]): void {
    this.log('warn', logSymbols.warning, ...args)
  },

  error(...args: unknown[]): void {
    this.log('error', logSymbols.error, ...args)
  },
}
