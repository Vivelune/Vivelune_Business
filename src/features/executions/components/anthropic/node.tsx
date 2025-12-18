"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { AnthropicDialog, AnthropicFormValues } from "./dialog";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";
import { fetchAnthropicRealtimeToken } from "./actions";

type AnthropicNodeData = {
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
    
         
};
 
type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes } = useReactFlow();


    const handleSubmit = (values : AnthropicFormValues) =>{
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
        channel: ANTHROPIC_CHANNEL_NAME,
        // channel: httpRequestChannel().name,
        topic: "status",
        refreshToken: fetchAnthropicRealtimeToken,
    })

    const handleOpenSettings = ()=>setDialogOpen(true);


    const nodeData = props.data;
    const description = nodeData?.userPrompt
    ? `claude-3-5-haiku-latest : ${nodeData.userPrompt.slice(0,50)}... `
    : "Not Configured"



    return (
        <>
        <AnthropicDialog
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        /> 
        <BaseExecutionNode
         {...props}
         id={props.id}
         icon="/anthropic.svg"
         name="Anthropic"
         status={nodeStatus}
         description={description}
         onSettings={handleOpenSettings}
         onDoubleClick={handleOpenSettings}
         />
         </>
    )
}
)


AnthropicNode.displayName = "AnthropicNode";