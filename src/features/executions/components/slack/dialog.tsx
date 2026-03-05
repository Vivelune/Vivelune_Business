"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Image from "next/image";
import { 
  Send, 
  X, 
  Hash, 
  Link, 
  MessageSquare, 
  Activity, 
  ShieldCheck, 
  Rocket, 
  Terminal,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  variableName: z.string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "Must start with letter/underscore and contain only letters/numbers"
    }),
  content: z.string().min(1, "Message content is required"),
  webhookUrl: z.string().min(1, "Webhook URL is required").url("Must be a valid URL")
});

export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SlackFormValues) => void;
  defaultValues?: Partial<SlackFormValues>;
}

export const SlackDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<SlackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "mySlack",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || "",
    }
  });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "mySlack";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[95vw] h-[85vh] p-0 flex flex-col overflow-hidden border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_0_50px_-12px_rgba(79,70,229,0.15)]">
        
        {/* HEADER */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-950/50 shrink-0">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Send className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                Slack Dispatcher
                <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-indigo-500/30 text-indigo-400 bg-indigo-500/5">
                  Webhook_v1
                </Badge>
              </DialogTitle>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Activity className="size-2.5" /> Messaging_Protocol
              </p>
            </div>
          </div>
         
        </div>

        {/* FORM CONTENT */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-6 space-y-8">
                
                {/* CORE CONFIG */}
                <div className="grid grid-cols-1 gap-6">
                  <FormField control={form.control} name="variableName" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-indigo-500/70">
                        <Hash className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">Node_Handle</FormLabel>
                      </div>
                      <FormControl>
                        <Input className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs font-mono text-zinc-300 focus:border-indigo-500/50" {...field} />
                      </FormControl>
                      <FormDescription className="text-[9px] text-zinc-600 font-medium">
                        Reference the payload status: <code className="text-indigo-400">{`{{${watchVariableName}.text}}`}</code>
                      </FormDescription>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="webhookUrl" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-indigo-500/70">
                        <Link className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">Webhook_URL</FormLabel>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="https://hooks.slack.com/services/..." 
                          className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs font-mono text-zinc-300" 
                          {...field} 
                        />
                      </FormControl>
                      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3 flex items-start gap-3">
                        <AlertCircle className="size-3.5 text-indigo-400 mt-0.5" />
                        <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                          Ensure your Slack Workflow is active and expects a <code className="bg-zinc-800 px-1 text-indigo-300 font-mono">content</code> variable in the JSON payload.
                        </p>
                      </div>
                    </FormItem>
                  )} />
                </div>

                {/* MESSAGE AREA */}
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-500/70">
                      <Terminal className="size-3" />
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest">Message_Body</FormLabel>
                    </div>
                    <FormControl>
                      <Textarea 
                        className="min-h-[220px] border-zinc-800 rounded-xl font-mono text-xs bg-zinc-900/30 text-zinc-300 p-4 focus:border-indigo-500/30 resize-none leading-relaxed" 
                        placeholder="Project Summary: {{myGemini.text}}" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-[9px] text-zinc-600">
                      Supports Markdown and Handlebars variables.
                    </FormDescription>
                  </FormItem>
                )} />
              </div>
            </ScrollArea>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-950/50 shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-3.5 text-indigo-500/50" />
                <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Hashed_Endpoint</span>
                <Separator orientation="vertical" className="h-4 bg-zinc-800" />
                <span className="text-[8px] text-zinc-600 font-mono">200_OK_Awaited</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)} 
                  className="text-[10px] font-black uppercase text-zinc-500 h-9 px-4 hover:bg-zinc-900"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Rocket className="size-3.5" />
                  Deploy Config
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};