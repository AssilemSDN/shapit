export interface SourceLoader<T = unknown> {
  /**
   * Loads data from the source.
   *
   * @param config The configuration for the source.
   * @param baseDir The base directory to resolve relative paths from.
   * @returns A promise that resolves to an array of the loaded data.
   */
  load(config: T, baseDir: string): Promise<unknown[]>
}
