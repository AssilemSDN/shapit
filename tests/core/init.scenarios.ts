import { ErrorCodes } from '../../src/index.js'

export const invalidFileNames = [
  '',
  '   ',
  '.',
  '..',
  'sub/config.yml',
  'sub\\config.yml',
  'config:evil.yml',
  'config\0.yml',
  '../config.yml',
]

interface WriteErrorScenario {
  name: string
  content: {
    errno?: string
  }
  expected: {
    code: (typeof ErrorCodes)[keyof typeof ErrorCodes]
    detailsPath: 'directory' | 'config'
  }
}

export const writeErrorScenarios = [
  {
    name: 'maps EEXIST to CONFIG_ALREADY_EXISTS',
    content: { errno: 'EEXIST' },
    expected: { code: ErrorCodes.CONFIG_ALREADY_EXISTS, detailsPath: 'config' },
  },
  {
    name: 'maps ENOENT to PATH_NOT_FOUND',
    content: { errno: 'ENOENT' },
    expected: { code: ErrorCodes.PATH_NOT_FOUND, detailsPath: 'directory' },
  },
  {
    name: 'maps ENOTDIR to PATH_NOT_FOUND',
    content: { errno: 'ENOTDIR' },
    expected: { code: ErrorCodes.PATH_NOT_FOUND, detailsPath: 'directory' },
  },
  {
    name: 'maps EACCES to PERMISSION_DENIED',
    content: { errno: 'EACCES' },
    expected: { code: ErrorCodes.PERMISSION_DENIED, detailsPath: 'config' },
  },
  {
    name: 'maps EPERM to PERMISSION_DENIED',
    content: { errno: 'EPERM' },
    expected: { code: ErrorCodes.PERMISSION_DENIED, detailsPath: 'config' },
  },
  {
    name: 'maps an unknown errno to CONFIG_WRITE_ERROR',
    content: { errno: 'EIO' },
    expected: { code: ErrorCodes.CONFIG_WRITE_ERROR, detailsPath: 'config' },
  },
  {
    name: 'maps an error without errno to CONFIG_WRITE_ERROR',
    content: {},
    expected: { code: ErrorCodes.CONFIG_WRITE_ERROR, detailsPath: 'config' },
  },
] satisfies WriteErrorScenario[]
