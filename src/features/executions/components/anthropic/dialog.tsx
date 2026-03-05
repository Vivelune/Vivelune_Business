"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, Terminal, Cpu, Database, Save, AlertTriangle, ActivityIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    variableName: z.string()
    .min(1, {message: "AUTH_ERR::VARIABLE_REQUIRED"})
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {message: "VARIABLE_ERR::INVALID_SYNTAX"}),
    credentialId: z.string().min(1, "AUTH_ERR::CREDENTIAL_REQUIRED"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "AUTH_ERR::PROMPT_REQUIRED"),
})

export type AnthropicFormValues = z.infer<typeof formSchema>

interface Props {
    open: boolean;
    onOpenChange : (open: boolean) => void
    onSubmit: (values: AnthropicFormValues) => void;
    defaultValues?: Partial<AnthropicFormValues>;
}

export const AnthropicDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}:Props)=>{
    
    const { data: credentials, isLoading: isLoadingCredentials } = useCredentialsByType(CredentialType.ANTHROPIC)

    const form = useForm<AnthropicFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            variableName: defaultValues.variableName || "",
            credentialId: defaultValues.credentialId || "",            
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
        }
    })
    
    useEffect(() => {
        if(open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                credentialId: defaultValues.credentialId || "",            
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",  
            })
        }
    }, [open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "anthropic_node";

    const handleSubmit = (values: AnthropicFormValues)=>{
        onSubmit(values);
        onOpenChange(false);
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 rounded-none border-2 border-zinc-800 bg-[#09090B] overflow-hidden gap-0">
                {/* Industrial Header */}
                <div className="bg-zinc-900/50 p-6 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="size-10 border border-[#FF6B00] bg-[#FF6B00]/5 flex items-center justify-center">
                            <Brain className="size-6 text-[#FF6B00]" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-black uppercase tracking-[3px] text-zinc-100 italic">
                                Anthropic_Uplink_Config
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                Secure_Module // Model: Claude-3-Haiku-Opus-Spec
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
                        
                        {/* 01 Variable Mapping */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="variableName"
                                render={({field})=>(
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-[2px] text-zinc-500">
                                            01_Alias_Mapping
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input {...field} className="rounded-none bg-zinc-950 border-zinc-800 h-10 text-[11px] font-mono tracking-widest focus-visible:ring-0 focus-visible:border-[#FF6B00]" />
                                                <Terminal className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-zinc-800" />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-[8px] font-bold text-zinc-600 uppercase">
                                            Reference: <span className="text-[#FF6B00]">{`{{${watchVariableName}.text}}`}</span>
                                        </FormDescription>
                                        <FormMessage className="text-[8px] text-red-500 font-bold uppercase" /> 
                                    </FormItem>
                                )}
                            />

                            {/* 02 Credential Handshake */}
                            <FormField
                                control={form.control}
                                name="credentialId"
                                render={({field})=>(
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-[2px] text-zinc-500">
                                            02_Auth_Handshake
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCredentials || !credentials?.length}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-none bg-zinc-950 border-zinc-800 h-10 text-[11px] font-mono tracking-widest focus:ring-0">
                                                    <SelectValue placeholder="SELECT_KEY..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-black border-zinc-800 rounded-none">
                                                {credentials?.map((credential)=>(
                                                    <SelectItem key={credential.id} value={credential.id} className="text-[10px] font-black uppercase tracking-widest focus:bg-[#FF6B00]/10 focus:text-white rounded-none">
                                                        <div className="flex items-center gap-2">
                                                            <Database className="size-3 text-[#FF6B00]" />
                                                            {credential.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[8px] text-red-500 font-bold uppercase" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 03 Prompts */}
                        <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <FormField
                                control={form.control}
                                name="systemPrompt"
                                render={({field})=>(
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-[2px] text-zinc-500 flex items-center gap-2">
                                            <Cpu className="size-3" /> 03_System_Behavior (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className="rounded-none bg-zinc-950 border-zinc-800 min-h-20 text-[11px] font-mono tracking-widest focus-visible:ring-0 focus-visible:border-[#FF6B00]" />
                                        </FormControl>
                                        <FormMessage className="text-[8px] text-red-500 font-bold uppercase" /> 
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="userPrompt"
                                render={({field})=>(
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-[2px] text-zinc-500 flex items-center gap-2">
                                            <ActivityIcon className="size-3" /> 04_Task_Input
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className="rounded-none bg-zinc-950 border-zinc-800 min-h-[140px] text-[11px] font-mono tracking-widest focus-visible:ring-0 focus-visible:border-[#FF6B00]" />
                                        </FormControl>
                                        <FormMessage className="text-[8px] text-red-500 font-bold uppercase" /> 
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Footer Info */}
                        <div className="p-3 border border-zinc-800 bg-zinc-950/50 flex gap-4">
                            <AlertTriangle className="size-4 text-[#FF6B00] shrink-0" />
                            <p className="text-[8px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">
                                Parser Note: Use {"{{variable}}"} for injection. All outputs are sanitized via the Vivelune core processor.
                            </p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="rounded-none bg-[#FF6B00] hover:bg-[#FF8533] text-black font-black uppercase text-[10px] tracking-[3px] h-10 px-10 shadow-[0_0_20px_rgba(255,107,0,0.15)]">
                                <Save className="size-4 mr-2" />
                                Commit_Config
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}