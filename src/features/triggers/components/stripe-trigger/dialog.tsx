"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  CopyIcon, 
  Activity, 
  Terminal, 
  Database, 
  ExternalLink, 
  CreditCard, 
  ShieldCheck, 
  Zap,
  Code2,
  BookOpen
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const formSchema = z.object({
  variableName: z.string().min(1, "Handle required").regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/),
});

type StripeFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: StripeFormValues) => void;
  defaultValues?: Partial<StripeFormValues>;
}

export const StripeTriggerDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const baseUrl = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_APP_URL_DEVELOPMENT : process.env.NEXT_PUBLIC_APP_URL;

  const form = useForm<StripeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "stripe",
    },
  });

  useEffect(() => { if (open) form.reset(defaultValues); }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "stripe";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}&variableName=${watchVariableName}`;

  const copyAction = async (text: string, msg: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(msg);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] w-[95vw] h-[90vh] p-0 flex flex-col border-zinc-800 bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-zinc-800/50 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/5">
              <CreditCard className="size-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-sm font-black uppercase tracking-tight text-zinc-100 flex items-center gap-2">
                Stripe_Ingress_Protocol
                <Badge variant="outline" className="text-[9px] border-indigo-500/30 text-indigo-400 bg-indigo-500/5 py-0">v3.0_API</Badge>
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="size-3 text-indigo-500" /> Payment_Gateway
                </span>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-10 pb-12">
            
            {/* SECTION 1: ENDPOINT */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-1.5 rounded-full bg-indigo-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">01_Target_Endpoint</h3>
              </div>
              
              <div className="p-4 rounded-xl bg-black border border-zinc-800 shadow-inner group relative">
                <p className="text-[10px] font-mono text-indigo-400/80 break-all leading-relaxed pr-8">{webhookUrl}</p>
                <button 
                  onClick={() => copyAction(webhookUrl, "URL Copied")}
                  className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
                >
                  <CopyIcon className="size-4" />
                </button>
              </div>
              <div className="flex items-start gap-2 px-2">
                <Terminal className="size-3 text-zinc-600 mt-0.5" />
                <p className="text-[10px] text-zinc-500 font-medium italic">
                  Paste this in <a href="https://dashboard.stripe.com/webhooks" target="_blank" className="text-indigo-400 hover:underline">Stripe Developers - Webhooks <ExternalLink className="size-2 inline"/></a>
                </p>
              </div>
            </section>

            {/* SECTION 2: VARIABLE CONFIG */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => { onSubmit?.(v); onOpenChange(false); })} className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-indigo-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">02_Variable_Mapping</h3>
                  </div>

                  <FormField control={form.control} name="variableName" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Output_Handle</FormLabel>
                      <FormControl><Input className="bg-zinc-900 border-zinc-800 rounded-xl h-11 text-xs font-mono" {...field} /></FormControl>
                      <FormDescription className="text-[9px] text-zinc-600 font-mono italic">Ref: {`{{${watchVariableName}.amount}}`}</FormDescription>
                    </FormItem>
                  )} />
                </section>

                {/* SECTION 3: SETUP MANUAL */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-indigo-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">03_Deployment_Steps</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Click 'Add Endpoint' in Stripe Dashboard",
                      "Paste the 01_Target_Endpoint URL",
                      "Select Events (e.g., checkout.session.completed)",
                      "Save and verify Signing Secret in your Environment"
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 items-center p-3 rounded-xl border border-zinc-800/50 bg-zinc-900/20">
                        <span className="text-[10px] font-mono font-black text-indigo-500">0{i+1}</span>
                        <p className="text-[11px] font-medium text-zinc-400">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECTION 4: PAYLOAD DICTIONARY */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-indigo-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">04_Available_Signals</h3>
                  </div>

                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {[
                      { title: "Core_Payload", vars: ["amount", "currency", "status", "customerId"] },
                      { title: "Customer_Meta", vars: ["customerEmail", "customerName"] },
                      { title: "Custom_Metadata", vars: ["metadata.userId", "metadata.plan"] }
                    ].map((group) => (
                      <AccordionItem key={group.title} value={group.title} className="border border-zinc-800 rounded-xl px-4 bg-zinc-900/30">
                        <AccordionTrigger className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-3 hover:no-underline hover:text-indigo-400">
                          {group.title.replace('_', ' ')}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 space-y-2">
                          {group.vars.map(v => (
                            <div key={v} className="flex items-center justify-between">
                              <code className="text-[10px] text-indigo-400">{`{{${watchVariableName}.${v}}}`}</code>
                              <Badge className="text-[8px] bg-zinc-800 text-zinc-500 border-none">SIG_DATA</Badge>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 text-[11px] font-black uppercase tracking-[3px] shadow-xl shadow-indigo-500/10">
                  Update_Stripe_Node
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};