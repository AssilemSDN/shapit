import type { ProjectContext } from "../core/types.js";

/**
 * Represents the type for an enricher function that transforms input data into
 * observed input data.
 *
 * @param TInput - The type of the input data.
 * @param TObservedInput - The type of the observed input data.
 * @returns A promise that resolves to the observed input data.
 */
export type Enricher<TInput, TObservedInput> = (
  input: TInput,
  context: ProjectContext,
) => Promise<TObservedInput>;
