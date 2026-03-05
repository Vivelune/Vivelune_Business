"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Image from "next/image";
import { 
  Sparkles, 
  X, 
  Hash, 
  Key, 
  Terminal, 
  MessageSquare, 
  BrainCircuit, 
  Activity, 
  ShieldCheck, 
  Rocket 
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

const formSchema = z.object({
  variableName: z.string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "Must start with letter/underscore and contain only letters/numbers"
    }),
  credentialId: z.string().min(1, "Credential is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const { data: credentials, isLoading: isLoadingCredentials } = useCredentialsByType(CredentialType.GEMINI);

  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credentialId: defaultValues.credentialId || "",
      variableName: defaultValues.variableName || "myGemini",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    }
  });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myGemini";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[95vw] h-[85vh] p-0 flex flex-col overflow-hidden border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_0_50px_-12px_rgba(249,115,22,0.15)]">
        
        {/* HEADER */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-950/50 shrink-0">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500">
              <Sparkles className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                Gemini AI
                <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-orange-500/30 text-orange-500 bg-orange-500/5">
                  Pro
                </Badge>
              </DialogTitle>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Activity className="size-2.5" /> Reasoning_Model
              </p>
            </div>
          </div>
        
        </div>

        {/* FORM CONTENT */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-6 space-y-8">
                
                {/* CONFIG SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="variableName" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-orange-500/70">
                        <Hash className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">Variable_Name</FormLabel>
                      </div>
                      <FormControl>
                        <Input className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs font-mono text-zinc-300 focus:border-orange-500/50" {...field} />
                      </FormControl>
                      <FormDescription className="text-[9px] text-zinc-600">
                        Result: <code className="text-orange-500">{`{{${watchVariableName}.text}}`}</code>
                      </FormDescription>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="credentialId" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-orange-500/70">
                        <Key className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">Gemini_Key</FormLabel>
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
                                <Image src="/gemini.svg" alt="" width={12} height={12} />
                                {c.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>

                {/* PROMPT SECTION */}
                <div className="space-y-6">
                  <FormField control={form.control} name="systemPrompt" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-orange-500/70">
                        <BrainCircuit className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">System_Context</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea 
                          className="min-h-[100px] border-zinc-800 rounded-xl font-mono text-xs bg-zinc-900/30 text-zinc-300 p-4 focus:border-orange-500/30 resize-none" 
                          placeholder="You are a specialized AI assistant..." 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="userPrompt" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-orange-500/70">
                        <MessageSquare className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">User_Query</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea 
                          className="min-h-[160px] border-zinc-800 rounded-xl font-mono text-xs bg-zinc-900/30 text-zinc-300 p-4 focus:border-orange-500/30 resize-none" 
                          placeholder="Process data: {{json step_1.result}}" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-[9px] text-zinc-600">
                        Supports <code className="bg-zinc-800 px-1 rounded">&#123;&#123;variables&#125;&#125;</code> and handlebars.
                      </FormDescription>
                    </FormItem>
                  )} />
                </div>
              </div>
            </ScrollArea>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-950/50 shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-3.5 text-orange-500/50" />
                <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Encrypted_Payload</span>
                <Separator orientation="vertical" className="h-4 bg-zinc-800" />
                <span className="text-[8px] text-zinc-600 font-mono">v1.1</span>
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
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <Rocket className="size-3.5" />
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};