"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscordDialog, DiscordFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { fetchDiscordRealtimeToken } from "./actions";

type DiscordNodeData = {
    webhookUrl?: string;
    content?: string;
    username?: string;
};
 
type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes } = useReactFlow();


    const handleSubmit = (values : DiscordFormValues) =>{
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
        channel: DISCORD_CHANNEL_NAME,
        // channel: httpRequestChannel().name,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken,
    })

    const handleOpenSettings = ()=>setDialogOpen(true);


    const nodeData = props.data;
    const description = nodeData?.content
    ? `Send : ${nodeData.content.slice(0,50)}... `
    : "Not Configured"



    return (
        <>
        <DiscordDialog
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        /> 
        <BaseExecutionNode
         {...props}
         id={props.id}
         icon="/discord.svg"
         name="Discord"
         status={nodeStatus}
         description={description}
         onSettings={handleOpenSettings}
         onDoubleClick={handleOpenSettings}
         />
         </>
    )
}
)


DiscordNode.displayName = "DiscordNode";