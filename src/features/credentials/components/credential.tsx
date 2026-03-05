"use client"

import { CredentialType } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { useCreateCredential, useSuspenseCredential, useUpdateCredential } from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, ShieldCheck, KeyIcon, ArrowRight, LinkIcon, Activity, CpuIcon, TerminalIcon, EyeOffIcon, Eye, Copy, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(1, "Identity name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API key is required"),
})

type FormValues = z.infer<typeof formSchema>

const credentialTypeOptions = [
    { value: CredentialType.OPENAI, label: "OpenAI", logo: "/openai.svg" },
    { value: CredentialType.GEMINI, label: "Gemini", logo: "/gemini.svg" },
    { value: CredentialType.ANTHROPIC, label: "Anthropic", logo: "/anthropic.svg" },
    { value: CredentialType.DEEPSEEK, label: "DeepSeek", logo: "/deepseek.svg" },
    { value: CredentialType.RESEND, label: "Resend", logo: "/resend.svg" },
    {
        value: CredentialType.WEBHOOK_SECRET,
        label: "Webhook Secret",
        logo: "/webhook.svg" // You'll need to add this icon
      }
]

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    }
}

export const CredentialForm = ({ initialData }: { initialData?: any }) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();
    const { handleError, modal } = useUpgradeModal();
    const [showKey, setShowKey] = useState(false);

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.OPENAI,
            value: "",
        }
    })

    const selectedType = form.watch("type");

    const onSubmit = async (values: FormValues) => {
        try {
            if (isEdit && initialData?.id) {
                await updateCredential.mutateAsync({ id: initialData.id, ...values })
                toast.success("SYSTEM_LOG: KEY_MODIFIED");
            } else {
                await createCredential.mutateAsync(values, {
                    onSuccess: () => {
                        toast.success("SYSTEM_LOG: KEY_INITIALIZED");
                        router.push("/credentials");
                    },
                    onError: (error) => handleError(error)
                })
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="min-h-screen bg-[#09090B] text-zinc-100 p-6 md:p-8 selection:bg-[#FF6B00]/30">
            {modal}
            
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header: Industrial Telemetry */}
                <header className="flex items-center gap-4 border-b border-zinc-900 pb-8">
                    <div className="size-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center relative">
                        <TerminalIcon className="size-6 text-[#FF6B00]" />
                        <div className="absolute top-0 left-0 size-2 border-t border-l border-[#FF6B00]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-[4px] italic">
                            {isEdit ? "Mod_Credential" : "Init_Credential"}
                        </h1>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[2px] mt-1">
                            Auth_Vault_System // Node: VLV-77-ALPHA
                        </p>
                    </div>
                </header>

                <Card className="rounded-none border-2 border-zinc-800 bg-black/40 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B00]" />
                    
                    <CardHeader className="bg-zinc-900/20 border-b border-zinc-800">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[3px] flex items-center gap-2">
                                <Activity className="size-3 text-[#FF6B00]" />
                                Input_Parameters
                            </CardTitle>
                            <Badge className="rounded-none bg-[#FF6B00] text-black font-black text-[8px] tracking-tighter">
                                {isEdit ? "SEC_WRITE_MODE" : "SEC_CREATE_MODE"}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                                
                                {/* Provider Selection: Industrial Grid */}
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[2px] text-zinc-500">
                                        01_Select_Provider
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {credentialTypeOptions.map((option) => {
                                            const isSelected = selectedType === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => form.setValue("type", option.value as any)}
                                                    className={cn(
                                                        "p-4 rounded-none border text-left transition-all",
                                                        isSelected 
                                                            ? "border-[#FF6B00] bg-[#FF6B00]/5 shadow-[0_0_15px_rgba(255,107,0,0.1)]" 
                                                            : "border-zinc-800 bg-black/20 hover:border-zinc-600"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest block",
                                                        isSelected ? "text-[#FF6B00]" : "text-zinc-500"
                                                    )}>
                                                        {option.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Form Inputs */}
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-[9px] font-black uppercase tracking-[2px] text-zinc-500">
                                                    02_Identity_Alias
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input 
                                                            {...field}
                                                            className="rounded-none bg-zinc-950 border-zinc-800 h-12 text-[11px] font-black uppercase tracking-widest focus-visible:ring-0 focus-visible:border-[#FF6B00] placeholder:text-zinc-800"
                                                            placeholder="PROD_API_KEY_01" 
                                                        />
                                                        <CpuIcon className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-zinc-800" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[8px] font-bold text-red-500 uppercase" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="value"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-[9px] font-black uppercase tracking-[2px] text-zinc-500">
                                                    03_Secret_Cipher
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input 
                                                            type={showKey ? "text" : "password"}
                                                            {...field}
                                                            className="rounded-none bg-zinc-950 border-zinc-800 h-12 text-[11px] font-mono tracking-widest focus-visible:ring-0 focus-visible:border-[#FF6B00] placeholder:text-zinc-800"
                                                            placeholder="••••••••••••••••••••" 
                                                        />
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-zinc-900 rounded-none"
                                                                onClick={() => setShowKey(!showKey)}
                                                            >
                                                                {showKey ? <EyeOffIcon className="size-3" /> : <Eye className="size-3" />}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-zinc-900 rounded-none"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(field.value);
                                                                    toast.success("CLIPBOARD::SYNC");
                                                                }}
                                                            >
                                                                <Copy className="size-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[8px] font-bold text-red-500 uppercase" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Security Warning */}
                                <div className="p-4 border border-zinc-800 bg-zinc-950/50 flex gap-4">
                                    <AlertTriangle className="size-4 text-[#FF6B00] shrink-0" />
                                    <p className="text-[8px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">
                                        Warning: This data will be encrypted with AES-256-GCM. 
                                        After initialization, the raw value will be obscured 
                                        from the UI permanently.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-6">
                                    <Button
                                        type="submit"
                                        disabled={createCredential.isPending || updateCredential.isPending}
                                        className="flex-1 h-12 bg-[#FF6B00] hover:bg-[#FF8533] text-black font-black uppercase text-[10px] tracking-[2px] rounded-none shadow-[0_0_20px_rgba(255,107,0,0.1)]"
                                    >
                                        {createCredential.isPending || updateCredential.isPending 
                                            ? "Executing..." 
                                            : isEdit ? "Communicate_Changes" : "Initialize_Write"}
                                        <ArrowRight className="size-4 ml-2" />
                                    </Button>
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                        className="h-12 border-zinc-800 rounded-none text-[10px] font-black uppercase tracking-[2px] px-8 hover:bg-zinc-900"
                                    >
                                        <Link href="/credentials">
                                            Abort
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Footer Security Badge */}
                <footer className="flex justify-center">
                    <div className="flex items-center gap-2 px-6 py-2 border border-zinc-900 bg-zinc-950/20">
                        <ShieldCheck className="w-3 h-3 text-[#FF6B00]" />
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[2px]">
                            E2E_Encrypted_Link_Active
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
    const { data: credential } = useSuspenseCredential(credentialId);
    return <CredentialForm initialData={credential} />
}