import toposort from "toposort";
import { Connection } from "@/generated/prisma/client";
import { Node } from "@/generated/prisma/client";


export const topologicalSort = (
    nodes : Node[],
    connections: Connection[],
): Node[] =>{

    // if no connections are present this will return the nodes as is
    if (connections.length === 0 ){
        return nodes;
    }

    // create edges array for toposort
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId
    ])

    // connection as self edges 

    const connectedNodeIds = new Set<string>();
    for (const conn of connections){
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }

    for (const node of nodes){
        if (!connectedNodeIds.has(node.id)){
            edges.push([node.id, node.id]);
        }
    }


    // perform topological sort
    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);
        // remove duplicated
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (error) {
        if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("Workflow contains a cycle.");
        }
        throw error;
    }




    // Map sorted Ids back to node objects
    const nodeMap= new Map(nodes.map((n)=>[n.id, n]))
    return sortedNodeIds.map((id)=> nodeMap.get(id)!).filter(Boolean)
}

