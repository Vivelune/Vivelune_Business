"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Image from "next/image";
import { 
  Zap, 
  X, 
  Hash, 
  Key, 
  Cpu, 
  MessageSquare, 
  Brain, 
  Activity, 
  ShieldCheck, 
  Rocket, 
  Loader2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import { useOpenAIModels } from "./hooks/use-openai-models";

const formSchema = z.object({
  variableName: z.string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "Must start with letter/underscore and contain only letters/numbers"
    }),
  credentialId: z.string().min(1, "Credential is required"),
  model: z.string().min(1, "Model is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type OpenAiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: OpenAiFormValues) => void;
  defaultValues?: Partial<OpenAiFormValues>;
}

export const OpenAiDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const { data: credentials, isLoading: isLoadingCredentials } = useCredentialsByType(CredentialType.OPENAI);
  const { data: models, isLoading: isLoadingModels, error: modelsError } = useOpenAIModels();

  const form = useForm<OpenAiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "myOpenAi",
      credentialId: defaultValues.credentialId || "",
      model: defaultValues.model || "",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    }
  });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myOpenAi";
  const watchModel = form.watch("model") || "Select Model";
  const selectedCredential = form.watch("credentialId");

  // Auto-default to gpt-4o-mini
  useEffect(() => {
    if (models?.length && !form.getValues("model")) {
      const defaultModel = models.find(m => m.id.includes('gpt-4o-mini')) || models[0];
      if (defaultModel) form.setValue("model", defaultModel.id);
    }
  }, [models, form]);

  const chatModels = models?.filter(model => 
    !model.id.includes('instruct') && !model.id.includes('embedding')
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[95vw] h-[85vh] p-0 flex flex-col overflow-hidden border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)]">
        
        {/* HEADER */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-950/50 shrink-0">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Zap className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                OpenAI Instance
                <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-emerald-500/30 text-emerald-500 bg-emerald-500/5">
                  {watchModel.split('-').slice(0,2).join('-')}
                </Badge>
              </DialogTitle>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Activity className="size-2.5" /> Neural_Compute_Unit
              </p>
            </div>
          </div>
          
        </div>

        {/* FORM CONTENT */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-6 space-y-8">
                
                {/* IDENTIFIER & CREDENTIAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="variableName" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-500/70">
                        <Hash className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">Variable_ID</FormLabel>
                      </div>
                      <FormControl>
                        <Input className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs font-mono text-zinc-300 focus:border-emerald-500/50" {...field} />
                      </FormControl>
                      <FormDescription className="text-[9px] text-zinc-600">
                        Reference: <code className="text-emerald-500">{`{{${watchVariableName}.text}}`}</code>
                      </FormDescription>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="credentialId" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-500/70">
                        <Key className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">OpenAI_Auth</FormLabel>
                      </div>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCredentials || !credentials?.length}>
                        <FormControl>
                          <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs">
                            <SelectValue placeholder="Select API Key" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          {credentials?.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-xs">
                              <div className="flex items-center gap-2">
                                <Image src="/openai.svg" alt="" width={12} height={12} className="invert" />
                                {c.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>

                {/* MODEL SELECTION */}
                <FormField control={form.control} name="model" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-500/70">
                      <Cpu className="size-3" />
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest">Compute_Model</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCredential || isLoadingModels}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs">
                          <SelectValue placeholder={isLoadingModels ? "Syncing models..." : "Select Model"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300 max-h-[250px]">
                        {chatModels.map((model) => (
                          <SelectItem key={model.id} value={model.id} className="text-xs">
                            <div className="flex flex-col">
                              <span>{model.id}</span>
                              <span className="text-[9px] opacity-50 uppercase tracking-tighter">Owner: {model.owned_by}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                {/* PROMPTS */}
                <div className="space-y-6">
                  <FormField control={form.control} name="systemPrompt" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-500/70">
                        <Brain className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">System_Behavior</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea 
                          className="min-h-[100px] border-zinc-800 rounded-xl font-mono text-xs bg-zinc-900/30 text-zinc-300 p-4 focus:border-emerald-500/30 resize-none" 
                          placeholder="You are an expert editor..." 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="userPrompt" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-500/70">
                        <MessageSquare className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">User_Instruction</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea 
                          className="min-h-[160px] border-zinc-800 rounded-xl font-mono text-xs bg-zinc-900/30 text-zinc-300 p-4 focus:border-emerald-500/30 resize-none" 
                          placeholder="Summarize: {{ai_output}}" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>
            </ScrollArea>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-950/50 shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-3.5 text-emerald-500/50" />
                <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">OpenAI_Secure</span>
                <Separator orientation="vertical" className="h-4 bg-zinc-800" />
                <span className="text-[8px] text-zinc-600 font-mono tracking-tighter">Latency: Optimal</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)} 
                  className="text-[10px] font-black uppercase text-zinc-500 h-9 px-4"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <Rocket className="size-3.5" />
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};