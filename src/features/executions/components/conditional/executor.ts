// src/features/executions/components/conditional/executor.ts
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { conditionalChannel } from "@/inngest/channels/conditional";
import { ConditionalNodeData, Condition } from "./types";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

/**
 * Evaluate a single condition
 */
function evaluateCondition(
  condition: Condition,
  context: Record<string, any>
): boolean {
  // Compile left value with Handlebars
  const leftTemplate = Handlebars.compile(condition.leftValue);
  const leftRaw = leftTemplate(context);
  
  // Parse left value (try JSON, fallback to raw string)
  let leftValue: any;
  try {
    leftValue = JSON.parse(leftRaw);
  } catch {
    leftValue = leftRaw;
  }

  // Handle exists/notExists operators
  if (condition.operator === "exists") {
    return leftValue !== null && leftValue !== undefined && leftValue !== "";
  }
  if (condition.operator === "notExists") {
    return leftValue === null || leftValue === undefined || leftValue === "";
  }

  // For other operators, we need right value
  if (!condition.rightValue) {
    throw new Error(`Right value required for operator: ${condition.operator}`);
  }

  // Compile right value
  const rightTemplate = Handlebars.compile(condition.rightValue);
  const rightRaw = rightTemplate(context);
  
  let rightValue: any;
  try {
    rightValue = JSON.parse(rightRaw);
  } catch {
    rightValue = rightRaw;
  }

  // Perform comparison based on operator
  switch (condition.operator) {
    case "equals":
      if (condition.caseSensitive) {
        return String(leftValue) === String(rightValue);
      }
      return String(leftValue).toLowerCase() === String(rightValue).toLowerCase();

    case "notEquals":
      if (condition.caseSensitive) {
        return String(leftValue) !== String(rightValue);
      }
      return String(leftValue).toLowerCase() !== String(rightValue).toLowerCase();

    case "greaterThan":
      return Number(leftValue) > Number(rightValue);

    case "lessThan":
      return Number(leftValue) < Number(rightValue);

    case "contains":
      return String(leftValue).toLowerCase().includes(String(rightValue).toLowerCase());

    case "startsWith":
      return String(leftValue).toLowerCase().startsWith(String(rightValue).toLowerCase());

    case "endsWith":
      return String(leftValue).toLowerCase().endsWith(String(rightValue).toLowerCase());

    default:
      return false;
  }
}

// src/features/executions/components/conditional/executor.ts
// Update the return statement at the end:

export const conditionalExecutor: NodeExecutor<ConditionalNodeData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    conditionalChannel().status({
      nodeId,
      status: "loading",
    })
  );

  try {
    // Validation
    if (!data.variableName) {
      throw new NonRetriableError("Conditional node: Variable name is missing");
    }

    if (!data.conditions || data.conditions.length === 0) {
      throw new NonRetriableError("Conditional node: No conditions configured");
    }

    // Evaluate all conditions
    const results = await step.run("evaluate-conditions", async () => {
      return data.conditions!.map(condition => ({
        condition,
        result: evaluateCondition(condition as Condition, context)
      }));
    });

    // Combine results based on logical operator
    const finalResult = data.logicalOperator === "and"
      ? results.every(r => r.result)
      : results.some(r => r.result);

    // Prepare output
    const output = {
      result: finalResult,
      conditions: results.map(r => ({
        operator: r.condition.operator,
        left: r.condition.leftValue,
        right: r.condition.rightValue,
        result: r.result
      })),
      path: finalResult ? (data.trueBranchName || "true") : (data.falseBranchName || "false"),
      evaluatedAt: new Date().toISOString(),
    };

    await publish(
      conditionalChannel().status({
        nodeId,
        status: "success",
      })
    );

    // Return both the output AND branch selection information
    return {
      ...context,
      [data.variableName!]: output,
      _branchSelection: {
        [nodeId]: {
          selected: finalResult ? 'true' : 'false',
          trueBranch: data.trueBranchName || "true",
          falseBranch: data.falseBranchName || "false"
        }
      }
    };

  } catch (error) {
    console.error(`❌ Conditional node ${nodeId} failed:`, error);

    await publish(
      conditionalChannel().status({
        nodeId,
        status: "error",
      })
    );

    if (error instanceof NonRetriableError) {
      throw error;
    }

    throw new NonRetriableError(
      `Conditional node failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};