import { readFile } from 'node:fs/promises'
import { query } from 'jsonpathly'
import { resolvePathInside } from '../../utils/resolve-project-path.js'
import type { SourceLoader } from '../types.js'
import type { JsonSource } from './schema.js'

/**
 * Loads and extracts values from a JSON file using JSONPath.
 */
export const jsonSourceLoader: SourceLoader<JsonSource> = {
  key: (config, baseDir) => `json:${(resolvePathInside(baseDir, config.file), 'utf-8')}`,

  async read(config, baseDir) {
    const filePath = resolvePathInside(baseDir, config.file)
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  },

  select: (data, config) => query(data, config.select, { returnArray: true }) as unknown[],
}
