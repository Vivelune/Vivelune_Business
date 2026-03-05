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
  FileText, 
  Code2, 
  Zap,
  ClipboardCheck
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { generateGoogleFormScript } from "./utils";

const formSchema = z.object({
  variableName: z.string().min(1, "Handle required").regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/),
});

type GoogleFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: GoogleFormValues) => void;
  defaultValues?: Partial<GoogleFormValues>;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const baseUrl = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_APP_URL_DEVELOPMENT : process.env.NEXT_PUBLIC_APP_URL;

  const form = useForm<GoogleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "googleForm",
    },
  });

  useEffect(() => { if (open) form.reset(defaultValues); }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "googleForm";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}&variableName=${watchVariableName}`;

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
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/5">
              <FileText className="size-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-sm font-black uppercase tracking-tight text-zinc-100 flex items-center gap-2">
                Google_Form_Protocol
                <Badge variant="outline" className="text-[9px] border-purple-500/30 text-purple-400 bg-purple-500/5 py-0">GAS_V1</Badge>
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="size-3 text-purple-500" /> Form_Listener
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
                <div className="size-1.5 rounded-full bg-purple-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">01_Target_Ingress</h3>
              </div>
              
              <div className="p-4 rounded-xl bg-black border border-zinc-800 shadow-inner group relative">
                <p className="text-[10px] font-mono text-purple-400/80 break-all leading-relaxed pr-8">{webhookUrl}</p>
                <Button 
                  variant="ghost" size="icon" className="absolute top-3 right-3 size-8 text-zinc-500 hover:text-white"
                  onClick={() => copyAction(webhookUrl, "URL Copied")}
                >
                  <CopyIcon className="size-4" />
                </Button>
              </div>
            </section>

            {/* SECTION 2: CONFIGURATION */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => { onSubmit?.(v); onOpenChange(false); })} className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-purple-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">02_Input_Parameters</h3>
                  </div>

                  <FormField control={form.control} name="variableName" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Output_Handle</FormLabel>
                      <FormControl><Input className="bg-zinc-900 border-zinc-800 rounded-xl h-11 text-xs font-mono" {...field} /></FormControl>
                      <FormDescription className="text-[9px] text-zinc-600 font-mono italic">Ref: {`{{${watchVariableName}.responses['Question']}}`}</FormDescription>
                    </FormItem>
                  )} />
                </section>

                {/* SECTION 3: APPS SCRIPT DEPLOYMENT */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-purple-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">03_Script_Deployment</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="size-3.5 text-purple-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Automated_GAS_Bridge</span>
                        </div>
                        <Button 
                          type="button" size="sm" variant="outline" className="h-7 text-[9px] font-black border-zinc-700 bg-zinc-800"
                          onClick={() => copyAction(generateGoogleFormScript(webhookUrl), "Apps Script Copied")}
                        >
                          <ClipboardCheck className="size-3 mr-2" /> COPY_SCRIPT
                        </Button>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                        This specialized script handles form submission parsing and pushes data to your secure endpoint.
                      </p>
                    </div>

                    <div className="space-y-3 px-2">
                      {[
                        "Open Google Form > Three Dots > Script Editor",
                        "Paste the copied bridge script",
                        "Save and click Triggers (Clock Icon)",
                        "Add Trigger: From Form > On Form Submit"
                      ].map((step, i) => (
                        <div key={i} className="flex gap-3 items-start group">
                          <span className="text-[10px] font-mono font-black text-purple-500 mt-0.5">0{i+1}</span>
                          <p className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* SECTION 4: PAYLOAD REFERENCE */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-purple-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">04_Data_Schema</h3>
                  </div>

                  <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/50">
                    {[
                      { key: "respondentEmail", desc: "User Email Address" },
                      { key: "responses['Key']", desc: "Specific Form Answer" },
                      { key: "timestamp", desc: "Submission Time" }
                    ].map(v => (
                      <div key={v.key} className="flex items-center justify-between p-3 bg-black/40 px-4">
                        <code className="text-[10px] text-purple-400">{`{{${watchVariableName}.${v.key}}}`}</code>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-600">{v.desc}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl h-12 text-[11px] font-black uppercase tracking-[3px] shadow-xl shadow-purple-500/10 transition-all">
                  Initialize_Bridge
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};