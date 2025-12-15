"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { HTTP_REQUEST_CHANNEL_NAME, httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "./actions";

type HttpRequestNodeData = {
    endpoint?:string;
    method?: "GET" | "POST" | "PUT" | "PATCH"| "DELETE";
    body?: string;
    variableName?: string;
    
         
};
 
type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes } = useReactFlow();


    const handleSubmit = (values : HttpRequestFormValues) =>{
        setNodes((nodes)=> nodes.map((node)=>{
            if (node.id === props.id){
                return {
                    ...node, 
                    data: {
                        ...node.data,
                        ...values
                    }
                }
            }
            return node;
        }))
    }


    const nodeStatus = useNodeStatus({
        nodeId:props.id,
        channel: HTTP_REQUEST_CHANNEL_NAME,
        // channel: httpRequestChannel().name,
        topic: "status",
        refreshToken: fetchHttpRequestRealtimeToken,
    })

    const handleOpenSettings = ()=>setDialogOpen(true);


    const nodeData = props.data;
    const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"} : ${nodeData.endpoint} `
    : "Not Configured"



    return (
        <>
        <HttpRequestDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        /> 
        <BaseExecutionNode
         {...props}
         id={props.id}
         icon={GlobeIcon}
         name="HTTP Request"
         status={nodeStatus}
         description={description}
         onSettings={handleOpenSettings}
         onDoubleClick={handleOpenSettings}
         />
         </>
    )
}
)


HttpRequestNode.displayName = "HttpRequestNode";