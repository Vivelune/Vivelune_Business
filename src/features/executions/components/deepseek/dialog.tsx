"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Image from "next/image";
import { 
  Settings2, Sparkles, X, Database, Terminal, Cpu, Info 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";

const formSchema = z.object({
  variableName: z.string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, { message: "Invalid identifier format" }),
  credentialId: z.string().min(1, "Credential is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type DeepseekFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DeepseekFormValues) => void;
  defaultValues?: Partial<DeepseekFormValues>;
}

export const DeepseekDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const { data: credentials, isLoading: isLoadingCredentials } = useCredentialsByType(CredentialType.DEEPSEEK);

  const form = useForm<DeepseekFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "deepseek_result",
      credentialId: defaultValues.credentialId || "",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "deepseek_result",
        credentialId: defaultValues.credentialId || "",
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "result";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] p-0 overflow-hidden border-zinc-800 bg-[#09090B] text-zinc-100 rounded-none shadow-2xl flex flex-col h-[85vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/50 text-blue-400">
              <Sparkles className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xs font-black uppercase tracking-[4px]">AI_Processor_v4.1</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold font-mono">MODEL: DEEPSEEK-V3</span>
              </div>
            </div>
          </div>
         
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-[#050505] px-4 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* CORE IDENTITY */}
              <div className="grid grid-cols-2 gap-6 p-6 bg-zinc-900/20 border border-zinc-800/50">
                <FormField
                  control={form.control}
                  name="variableName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Output_Identifier</FormLabel>
                      <FormControl>
                        <Input className="bg-black border-zinc-800 rounded-none h-10 font-mono text-xs text-blue-400 focus:border-blue-500" {...field} />
                      </FormControl>
                      <p className="text-[9px] text-zinc-600 font-mono mt-2">
                        {"REF_ID: {{ "}{watchVariableName}{".text }}"}
                      </p>
                      <FormMessage className="text-[10px] uppercase font-bold text-red-500 mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credentialId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Authentication_Key</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCredentials || !credentials?.length}>
                        <FormControl>
                          <SelectTrigger className="bg-black border-zinc-800 rounded-none h-10 font-bold uppercase text-[10px]">
                            <SelectValue placeholder="Access Denied: Select Key" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-none">
                          {credentials?.map((credential) => (
                            <SelectItem key={credential.id} value={credential.id} className="uppercase text-[9px] font-bold">
                              {credential.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px] uppercase font-bold text-red-500 mt-2" />
                    </FormItem>
                  )}
                />
              </div>

              {/* PROMPTS */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="systemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <Terminal className="size-3 text-zinc-500" />
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500">System_Directive</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea 
                          placeholder="Initialize assistant personality..." 
                          className="min-h-24 bg-black border-zinc-800 rounded-none font-mono text-xs text-zinc-300 focus:border-blue-500 transition-colors resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <Database className="size-3 text-blue-500" />
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-blue-400">Execution_Prompt</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea 
                          placeholder="Process_Payload: {{json input_data}}" 
                          className="min-h-48 bg-black border-zinc-800 rounded-none font-mono text-xs text-zinc-100 focus:border-blue-500 transition-colors" 
                          {...field} 
                        />
                      </FormControl>
                      <div className="flex items-center gap-2 mt-3 text-[9px] text-zinc-500 font-mono italic">
                        <Info className="size-3" />
                        <span>Support: {"{{variables}}"} and {"{{json variable}}"} syntax.</span>
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
            <Button onClick={form.handleSubmit(onSubmit)} className="rounded-none bg-blue-600 text-white hover:bg-blue-500 h-10 px-10 text-[10px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Apply_Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};