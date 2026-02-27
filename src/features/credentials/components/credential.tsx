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
import { InfoIcon, ShieldCheck, KeyIcon, ArrowRight, LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();
    const { handleError, modal } = useUpgradeModal();

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.OPENAI,
            value: "",
        }
    })

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData?.id) {
            await updateCredential.mutateAsync({ id: initialData.id, ...values })
        } else {
            await createCredential.mutateAsync(values, {
                onSuccess: () => router.push("/credentials"),
                onError: (error) => handleError(error)
            })
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-6">
            {modal}
            <Card className="rounded-none border-[#DCD5CB] bg-[#F4F1EE] shadow-none overflow-hidden">
                <div className="h-1 bg-[#1C1C1C] w-full" />
                <CardHeader className="pt-8 px-8 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-8 bg-[#1C1C1C] flex items-center justify-center">
                            <KeyIcon className="size-4 text-[#E7E1D8]" />
                        </div>
                        <CardTitle className="text-xl font-medium tracking-tight uppercase">
                            {isEdit ? "Identity Configuration" : "New Secret Ritual Identity"}
                        </CardTitle>
                    </div>
                    <CardDescription className="italic text-[#8E8E8E] font-light">
                        {isEdit 
                            ? "Securely modify the keys for your studio credentials."
                            : "Integrate a new intelligence provider into your ritual workflow."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase tracking-[2px] font-bold">Identity Name</FormLabel>
                                            <FormControl>
                                                <Input className="rounded-none border-[#DCD5CB] bg-white focus-visible:ring-[#1C1C1C]" placeholder="e.g. Master GPT-4o Key" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-[10px] uppercase font-bold text-red-600" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase tracking-[2px] font-bold">Provider Platform</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-none border-[#DCD5CB] bg-white focus-visible:ring-[#1C1C1C]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-none border-[#DCD5CB]">
                                                    {credentialTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value} className="text-xs uppercase tracking-wider font-medium cursor-pointer">
                                                            <div className="flex items-center gap-2">
                                                                <Image src={option.logo} alt={option.label} width={14} height={14} className="grayscale brightness-0" />
                                                                {option.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px] uppercase font-bold text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase tracking-[2px] font-bold">Encrypted API Key</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••••••••••" className="rounded-none border-[#DCD5CB] bg-white focus-visible:ring-[#1C1C1C]" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[10px] uppercase font-bold text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={createCredential.isPending || updateCredential.isPending}
                                    className="bg-[#1C1C1C] text-[#E7E1D8] hover:bg-[#333] rounded-none px-8 h-12 uppercase text-[11px] tracking-[3px] font-bold flex items-center group"
                                >
                                    {isEdit ? "Update Ritual Access" : "Secure Credential"}
                                    <ArrowRight className="ml-2 size-3 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button type="button" variant="ghost" asChild className="rounded-none text-[#8E8E8E] hover:text-[#1C1C1C] uppercase text-[10px] tracking-widest font-bold">
                                    <Link href="/credentials" prefetch>Cancel</Link>
                                </Button>
                            </div>
                            {form.watch("type") === CredentialType.WEBHOOK_SECRET && (
  <Alert className="mt-4 bg-blue-50 border-blue-200">
    <KeyIcon className="h-4 w-4 text-blue-600" />
    <AlertDescription className="text-blue-800">
      <p className="font-medium mb-2">🔐 How to get a webhook signing secret:</p>
      <ol className="list-decimal ml-4 text-sm space-y-1">
        <li>Go to your service's dashboard (Clerk, Stripe, GitHub, etc.)</li>
        <li>Navigate to Webhooks section</li>
        <li>Create a new webhook endpoint or view existing one</li>
        <li>Look for "Signing Secret" or "Webhook Secret"</li>
        <li>Copy the secret and paste it here</li>
        <li>Give it a descriptive name (e.g., "Clerk Production Webhook")</li>
      </ol>
      <p className="mt-2 text-xs">⚠️ This secret will be encrypted and never shown again.</p>
    </AlertDescription>
  </Alert>
)}   
                            {form.watch("type") === CredentialType.RESEND && (
                                <div className="border border-[#DCD5CB] bg-white p-6 rounded-none mt-6">
                                    <div className="flex items-center gap-2 mb-4 border-b border-[#DCD5CB] pb-2">
                                        <ShieldCheck className="size-4 text-[#1C1C1C]" />
                                        <p className="text-[10px] font-black uppercase tracking-[2px]">Resend Integration Protocol</p>
                                    </div>
                                    <ol className="space-y-3">
                                        {[
                                            "Authenticate at resend.com",
                                            "Verify your primary domain",
                                            "Generate a production API key",
                                            "Deploy the key to Vivelune Vault"
                                        ].map((step, i) => (
                                            <li key={i} className="flex items-center gap-3 text-[11px] font-medium text-[#4A4A4A]">
                                                <span className="size-4 flex items-center justify-center bg-[#1C1C1C] text-[#E7E1D8] text-[8px] font-black">{i + 1}</span>
                                                <span className="uppercase tracking-wide">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
                <ShieldCheck className="size-3 text-[#1C1C1C]" />
                <span className="text-[9px] uppercase tracking-[2px] font-bold text-[#1C1C1C]">End-to-End Encryption Enabled</span>
            </div>
        </div>
    )
}

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
    const { data: credential } = useSuspenseCredential(credentialId);
    return <CredentialForm initialData={credential} />
}