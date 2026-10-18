import type { ProjectContext } from '../core/types.js'

/**
 * Represents a function that enriches input data of type `TInput` into observed input data of type `TObservedInput`.
 * The function takes an input of type `TInput` and a `ProjectContext`, and returns a promise that resolves to the enriched data of type `TObservedInput`.
 *
 * @template TInput - The type of the input data to be enriched.
 * @template TObservedInput - The type of the enriched data that is returned.
 * @param input - The input data to be enriched.
 * @param context - The project context providing necessary information for enrichment.
 * @returns A promise that resolves to the enriched data of type `TObservedInput`.
 */
export type Enricher<TInput, TObservedInput> = (
  input: TInput,
  context: ProjectContext,
) => Promise<TObservedInput>
