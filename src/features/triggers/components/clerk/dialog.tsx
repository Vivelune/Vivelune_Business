"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription // Added missing import
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  CopyIcon,
  UserIcon,
  ShieldCheck,
  Terminal,
  Activity,
  Database,
  ExternalLink,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { WebhookSecretSelector } from "@/features/credentials/components/webhook-secret-selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const EVENT_TYPES = [
  'user.created', 'user.updated', 'user.deleted', 'session.created', 'session.ended', 'email.created'
] as const;

const formSchema = z.object({
  variableName: z.string().min(1, "Handle required").regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/),
  eventType: z.enum(EVENT_TYPES),
  includeMetadata: z.boolean(),
  includeUserData: z.boolean(),
  secretId: z.string().optional(),
});

export type ClerkFormValues = z.infer<typeof formSchema>;

// Fixed: Added missing Props interface
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClerkFormValues) => void;
  defaultValues?: Partial<ClerkFormValues>;
}

export const ClerkTriggerDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const baseUrl = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_APP_URL_DEVELOPMENT : process.env.NEXT_PUBLIC_APP_URL;

  const form = useForm<ClerkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "clerkEvent",
      eventType: defaultValues.eventType || "user.created",
      includeMetadata: defaultValues.includeMetadata ?? true,
      includeUserData: defaultValues.includeUserData ?? true,
      secretId: defaultValues.secretId || "",
    },
  });

  useEffect(() => { 
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "clerkEvent",
        eventType: defaultValues.eventType || "user.created",
        includeMetadata: defaultValues.includeMetadata ?? true,
        includeUserData: defaultValues.includeUserData ?? true,
        secretId: defaultValues.secretId || "",
      });
    } 
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "clerkEvent";
  const webhookUrl = `${baseUrl}/api/webhooks/clerk-trigger?workflowId=${workflowId}&variableName=${watchVariableName}${form.watch("secretId") ? `&secretId=${form.watch("secretId")}` : ''}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] w-[95vw] h-[90vh] p-0 flex flex-col border-zinc-800 bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="px-6 py-5 border-b border-zinc-800/50 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <UserIcon className="size-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-sm font-black uppercase tracking-tight text-zinc-100 flex items-center gap-2">
                Clerk_Ingress_Protocol
                <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5 py-0">LIVE</Badge>
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="size-3 text-blue-500" /> System_Trigger
                </span>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-10 pb-12">
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-1.5 rounded-full bg-blue-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">01_Connection_String</h3>
              </div>
              
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-black border border-zinc-800 shadow-inner group relative">
                  <p className="text-[10px] font-mono text-blue-400/80 break-all leading-relaxed pr-8">{webhookUrl}</p>
                  <Button 
                    variant="ghost" size="icon" className="absolute top-3 right-3 size-8 text-zinc-500 hover:text-white"
                    onClick={() => { navigator.clipboard.writeText(webhookUrl); toast.success("URL copied"); }}
                  >
                    <CopyIcon className="size-4" />
                  </Button>
                </div>
                <div className="flex items-start gap-2 px-2">
                  <Terminal className="size-3 text-zinc-600 mt-0.5" />
                  <p className="text-[10px] text-zinc-500 font-medium italic">
                    Configure in <a href="https://dashboard.clerk.com" target="_blank" className="text-blue-500 hover:underline">Clerk Dashboard <ExternalLink className="size-2 inline"/></a>
                  </p>
                </div>
              </div>
            </section>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-blue-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">02_Input_Parameters</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="variableName" render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Output_Handle</FormLabel>
                        <FormControl><Input className="bg-zinc-900 border-zinc-800 rounded-xl h-11 text-xs font-mono" {...field} /></FormControl>
                        <FormDescription className="text-[9px] text-zinc-600 font-mono italic">Ref: {`{{${watchVariableName}}}`}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="eventType" render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Event_Signal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 rounded-xl h-11 text-xs text-zinc-300">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                            {EVENT_TYPES.map(e => <SelectItem key={e} value={e} className="text-xs uppercase font-mono">{e}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="secretId" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-3 text-blue-500" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security_Handshake</FormLabel>
                      </div>
                      <WebhookSecretSelector value={field.value} onChange={field.onChange} provider="clerk" />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    {["includeUserData", "includeMetadata"].map((id) => (
                      <FormField key={id} control={form.control} name={id as any} render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 m-0">{id.replace('include', '')}</FormLabel>
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )} />
                    ))}
                  </div>
                </section>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12 text-[11px] font-black uppercase tracking-[3px]">
                  Synchronize_Node
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};