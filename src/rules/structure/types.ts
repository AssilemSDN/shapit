export type PathType = "file" | "directory";

/**
 * Represents the input structure for a rule that checks the existence
 * and type of a file system path.
 */
export interface StructureInput {
  path: string;
  pathType: PathType;
  fileExtension?: string[];
  required: boolean;
}

/**
 * Represents the observed input structure for a rule that checks the existence
 * and type of a file system path, including additional information about
 * whether the path exists and its actual type.
 */
export interface StructureObservedInput extends StructureInput {
  exists: boolean;
  actualType?: PathType | "other";
}
