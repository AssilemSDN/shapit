export type PathType = 'file' | 'directory' | 'any'

export type PathRequirement = 'exist' | 'not_exist'

/**
 * Represents the input structure for a rule that checks the existence
 * and type of a file system path.
 */
export interface StructureInput {
  path: string
  kind: PathType
  must: PathRequirement
}

/**
 * Represents the observed state of a resolved file system path.
 */
export interface PathObservation {
  path: string
  exists: boolean
  actualType?: Exclude<PathType, 'any'> | 'other'
}

/**
 * Represents a path rule enriched with file system observations.
 */
export interface StructureObservedInput extends StructureInput {
  observations: PathObservation[]
}
