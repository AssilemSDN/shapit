export interface SourceLoader<T = unknown> {
  /**
   * Generates a unique cache key for the source.
   *
   * @param config The configuration for the source.
   * @param baseDir The base directory to resolve relative paths from.
   */
  key(config: T, baseDir: string): string
  /**
   * Reads and parses data from the source.
   *
   * @param config The configuration for the source.
   * @param baseDir The base directory to resolve relative paths from.
   * @returns A promise that resolves to an array of the loaded data.
   */
  read(config: T, baseDir: string): Promise<unknown>

  /**
   * Selects values from the loaded data.
   *
   * @param data
   * @param baseDir The base directory to resolve relative paths from.
   */
  select(data: unknown, config: T): unknown[]
}
