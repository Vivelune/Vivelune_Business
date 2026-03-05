// src/features/executions/components/conditional/types.ts
import { z } from "zod";

// Define the operator enum as a const for runtime use
export const ConditionOperator = {
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  GREATER_THAN: "greaterThan",
  LESS_THAN: "lessThan",
  CONTAINS: "contains",
  STARTS_WITH: "startsWith",
  ENDS_WITH: "endsWith",
  EXISTS: "exists",
  NOT_EXISTS: "notExists",
} as const;

export type ConditionOperatorType = typeof ConditionOperator[keyof typeof ConditionOperator];

// Create a Zod enum from the operator values
export const operatorEnum = z.enum([
  "equals",
  "notEquals",
  "greaterThan",
  "lessThan",
  "contains",
  "startsWith",
  "endsWith",
  "exists",
  "notExists",
]);

// Condition schema for form validation
export const conditionSchema = z.object({
  id: z.string().optional(),
  leftValue: z.string().min(1, "Left value is required"),
  operator: operatorEnum,
  rightValue: z.string().optional(),
  caseSensitive: z.boolean().default(false),
}).refine((data) => {
  if (["exists", "notExists"].includes(data.operator)) {
    return true;
  }
  return !!data.rightValue;
}, {
  message: "Right value is required for this operator",
  path: ["rightValue"],
});

// Form schema
export const conditionalFormSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "Variable name must start with a letter or underscore",
    }),
  logicalOperator: z.enum(["and", "or"]).default("and"),
  conditions: z.array(conditionSchema).min(1, "At least one condition is required"),
  trueBranchName: z.string().optional(),
  falseBranchName: z.string().optional(),
});

// Export inferred types
export type Condition = z.infer<typeof conditionSchema>;
export type ConditionalFormValues = z.infer<typeof conditionalFormSchema>;

// Node data type (must extend Record<string, unknown> for React Flow)
export interface ConditionalNodeData extends Record<string, unknown> {
  variableName?: string;
  conditions?: Array<{
    id?: string;
    leftValue: string;
    operator: ConditionOperatorType;
    rightValue?: string;
    caseSensitive?: boolean;
  }>;
  logicalOperator?: "and" | "or";
  trueBranchName?: string;
  falseBranchName?: string;
}

// Helper function to convert Condition to form-compatible object
export const conditionToFormValue = (condition: NonNullable<ConditionalNodeData['conditions']>[0]) => ({
  id: condition.id || crypto.randomUUID(),
  leftValue: condition.leftValue,
  operator: condition.operator,
  rightValue: condition.rightValue || "",
  caseSensitive: condition.caseSensitive || false,
});