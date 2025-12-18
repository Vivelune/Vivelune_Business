"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { OpenAiDialog, OpenAiFormValues } from "./dialog";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { fetchOpenAiRealtimeToken } from "./actions";

type OpenAiNodeData = {
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
    
         
};
 
type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes } = useReactFlow();


    const handleSubmit = (values : OpenAiFormValues) =>{
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
        channel: OPENAI_CHANNEL_NAME,
        // channel: httpRequestChannel().name,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken,
    })

    const handleOpenSettings = ()=>setDialogOpen(true);


    const nodeData = props.data;
    const description = nodeData?.userPrompt
    ? `gpt-4o-mini : ${nodeData.userPrompt.slice(0,50)}... `
    : "Not Configured"



    return (
        <>
        <OpenAiDialog
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        /> 
        <BaseExecutionNode
         {...props}
         id={props.id}
         icon="/openai.svg"
         name="OpenAI"
         status={nodeStatus}
         description={description}
         onSettings={handleOpenSettings}
         onDoubleClick={handleOpenSettings}
         />
         </>
    )
}
)


OpenAiNode.displayName = "OpenAiNode";