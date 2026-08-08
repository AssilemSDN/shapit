import { z } from "zod";

import type { StructureInput } from "./types.js";

/**
 * Validates the parameters of a structure rule and transforms
 * YAML properties into the internal StructureInput representation.
 */
export const structureInputSchema = z
  // A rule is an object
  .object({
    path: z.string().min(1),
    path_type: z.enum(["file", "directory"]),
    file_extension: z.array(z.string()).optional(),
    required: z.boolean().default(true),
  })
  // Transforms the validated input into a StructureInput object
  .transform((value): StructureInput => ({
    path: value.path,
    pathType: value.path_type,
    fileExtension: value.file_extension,
    required: value.required,
  }));
