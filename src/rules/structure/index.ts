import { enrichStructureInput } from "../../enrichers/structure-enricher.js";
import { createRuleExecutor } from "../types.js";

import { auditStructure } from "./audit.js";
import { structureInputSchema } from "./schema.js";

/**
 * Extends the base RuleExecutor to create a specific executor for 
 * the "structure" rule.
 * @returns A RuleExecutor that validates, enriches, and audits the structure input.
 */
export const structureRule = createRuleExecutor({
  schema: structureInputSchema,
  enricher: enrichStructureInput,
  audit: auditStructure,
});
