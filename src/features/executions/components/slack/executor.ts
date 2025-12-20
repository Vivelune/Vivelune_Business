import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import {decode} from "html-entities"
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null , 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
})

type SlackData = {
    variableName?: string;
    webhookUrl?:string;
    content?:string;
}

export const slackExecutor: NodeExecutor<SlackData> = async({
    data,
    nodeId,
    context, 
    step,
    publish,
}) =>{


    await publish(
        slackChannel().status({
            nodeId,
            status:"loading",

        })
    )



console.log("WEBHOOK URL : " , data.webhookUrl )
    if (!data.webhookUrl){
          await publish(
        slackChannel().status({
            nodeId,
            status:"error",

        })
    )
    throw new NonRetriableError("Slack node: Webhook URL is missing")

    }


    if (!data.content){
          await publish(
        slackChannel().status({
            nodeId,
            status:"error",

        })
    )
    throw new NonRetriableError("Slack node: Content is missing")

    }

 

    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent);
   


try {
    const result = await step.run("slack-webhook", async ()=>{
        await ky.post(data.webhookUrl!, {
            json: {
                content: content, // key depends on the workflow key in SLACK
            }
        } );


    if (!data.variableName){
          await publish(
        slackChannel().status({
            nodeId,
            status:"error",

        })
    )
    throw new NonRetriableError("Slack node: Variable name is missing")

    }

        return {
            ...context,
            [data.variableName]: {
                slackMessageSent : true
            },
        }

    })


      await publish(
        slackChannel().status({
            nodeId,
            status:"success",

        })
    )

    return result;

} catch (error) {
      await publish(
        slackChannel().status({
            nodeId,
            status:"error",

        })


    )


    throw error;
}


}