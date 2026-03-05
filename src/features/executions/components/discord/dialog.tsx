"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { 
  MessageSquare, Hash, Link2, User, X, ShieldAlert, Terminal, Info 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  variableName: z.string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, { message: "Invalid identifier format" }),
  username: z.string().optional(),
  content: z.string().min(1, "Message content is required").max(2000, "Limit: 2000 chars"),
  webhookUrl: z.string().min(1, "Webhook URL is required").url("Must be a valid URL"),
});

export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DiscordFormValues) => void;
  defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<DiscordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: defaultValues.username || "",
      variableName: defaultValues.variableName || "discord_output",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        username: defaultValues.username || "",
        variableName: defaultValues.variableName || "discord_output",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "discord";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] p-0 overflow-hidden border-zinc-800 bg-[#09090B] text-zinc-100 rounded-none shadow-2xl flex flex-col h-[85vh]">
        
        {/* INDUSTRIAL HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#5865F2]/10 border border-[#5865F2]/50 text-[#5865F2]">
              <MessageSquare className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xs font-black uppercase tracking-[4px]">Comm_Uplink_v1.0</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="size-1.5 rounded-full bg-[#5865F2] animate-pulse" />
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold font-mono">PROTOCOL: DISCORD_WEBHOOK</span>
              </div>
            </div>
          </div>
         
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-[#050505] p-8 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              {/* CONNECTION BLOCK */}
              <div className="space-y-6 p-6 bg-zinc-900/20 border border-zinc-800/50">
                <FormField
                  control={form.control}
                  name="webhookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <Link2 className="size-3 text-zinc-500" />
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Target_Webhook_Endpoint</FormLabel>
                      </div>
                      <FormControl>
                        <Input className="bg-black border-zinc-800 rounded-none h-10 font-mono text-xs text-[#5865F2] focus:border-[#5865F2]" placeholder="https://discord.com/api/webhooks/..." {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold text-red-500 mt-2" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="variableName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Ref_Identifier</FormLabel>
                        <Input className="bg-black border-zinc-800 rounded-none h-10 font-mono text-xs text-zinc-400" {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Bot_Alias_Override</FormLabel>
                        <Input className="bg-black border-zinc-800 rounded-none h-10 font-mono text-xs text-zinc-400" placeholder="System_Bot" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* CONTENT BLOCK */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <Terminal className="size-3 text-[#5865F2]" />
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-[#5865F2]">Payload_Data (Markdown Supported)</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea 
                          className="min-h-48 bg-black border-zinc-800 rounded-none font-mono text-xs text-zinc-100 focus:border-[#5865F2] transition-colors" 
                          placeholder="Transmission_Message: {{variable_name}}"
                          {...field} 
                        />
                      </FormControl>
                      <div className="flex items-center gap-2 mt-3 text-[9px] text-zinc-500 font-mono">
                        <Info className="size-3" />
                        <span>Dynamic injection: Use {"{{variable}}"} or {"{{json variable}}"}.</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end items-center shrink-0">
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-none border-zinc-700 text-zinc-400 h-10 px-6 text-[10px] uppercase font-black tracking-widest">
              Abort
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} className="rounded-none bg-[#5865F2] text-white hover:bg-[#5865F2]/90 h-10 px-10 text-[10px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(88,101,242,0.3)]">
              Commit_Uplink
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};