"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { DeepseekDialog, DeepseekFormValues } from "./dialog";
import { DEEPSEEK_CHANNEL_NAME } from "@/inngest/channels/deepseek";
import { fetchDeepseekRealtimeToken } from "./actions";

type DeepseekNodeData = {
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
    credentialId?: string

    
         
};
 
type DeepseekNodeType = Node<DeepseekNodeData>;

export const DeepseekNode = memo((props: NodeProps<DeepseekNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes } = useReactFlow();


    const handleSubmit = (values : DeepseekFormValues) =>{
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
        channel: DEEPSEEK_CHANNEL_NAME,
        // channel: httpRequestChannel().name,
        topic: "status",
        refreshToken: fetchDeepseekRealtimeToken,
    })

    const handleOpenSettings = ()=>setDialogOpen(true);


    const nodeData = props.data;
    const description = nodeData?.userPrompt
    ? `deepseek-reasoner : ${nodeData.userPrompt.slice(0,50)}... `
    : "Not Configured"



    return (
        <>
        <DeepseekDialog
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        /> 
        <BaseExecutionNode
         {...props}
         id={props.id}
         icon="/deepseek.svg"
         name="DeepSeek"
         status={nodeStatus}
         description={description}
         onSettings={handleOpenSettings}
         onDoubleClick={handleOpenSettings}
         />
         </>
    )
}
)


DeepseekNode.displayName = "DeepSeekNode";