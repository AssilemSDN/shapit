/*
  PATH /src/utils/logger.ts
*/
import chalk from 'chalk'
import logSymbols from 'log-symbols'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogOptions {
  indent?: number
}

interface Logger {
  level: LogLevel
  log(level: LogLevel, ...args: unknown[]): void
  debug(...args: unknown[]): void
  info(message: unknown, options?: LogOptions): void
  success(message: unknown, options?: LogOptions): void
  warn(message: unknown, options?: LogOptions): void
  error(message: unknown, options?: LogOptions): void
}

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

function isLogLevel(value: string | undefined): value is LogLevel {
  return value !== undefined && Object.hasOwn(LEVELS, value)
}

function indentArgs(args: unknown[], indent = 0): unknown[] {
  if (indent <= 0) return args

  return [' '.repeat(indent) + String(args[0] ?? ''), ...args.slice(1)]
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

  info(message: unknown, options: LogOptions = {}): void {
    this.log('info', ...indentArgs([logSymbols.info, message], options.indent))
  },

  success(message: unknown, options: LogOptions = {}): void {
    this.log('info', ...indentArgs([logSymbols.success, message], options.indent))
  },

  warn(message: unknown, options: LogOptions = {}): void {
    this.log('warn', ...indentArgs([logSymbols.warning, message], options.indent))
  },

  error(message: unknown, options: LogOptions = {}): void {
    this.log('error', ...indentArgs([logSymbols.error, message], options.indent))
  },
}
