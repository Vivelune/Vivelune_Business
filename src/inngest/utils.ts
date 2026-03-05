// src/inngest/utils.ts
import toposort from "toposort";
import { Connection } from "@/generated/prisma/client";
import { Node } from "@/generated/prisma/client";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[],
): Node[] => {
    // If no connections are present, return nodes as is
    if (connections.length === 0) {
        return nodes;
    }

    // Create edges array for toposort (ignore branch-specific connections for sorting)
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId
    ]);

    // Add self edges for nodes with no connections
    const connectedNodeIds = new Set<string>();
    for (const conn of connections) {
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }

    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }

    // Perform topological sort
    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);
        // Remove duplicates
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (error) {
        if (error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Workflow contains a cycle.");
        }
        throw error;
    }

    // Map sorted Ids back to node objects
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
    workflowId: string;
    [key: string]: any;
}) => {
    return inngest.send({
        name: "workflows/execute.workflow",
        data,
        id: createId(),
    });
};