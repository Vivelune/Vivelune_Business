"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { 
  Mail, 
  Settings2, 
  X, 
  Terminal, 
  ShieldCheck, 
  Code2, 
  Hash, 
  SendHorizontal,
  Box,
  Zap,
  Activity,
  Copy,
  CheckCircle2,
  Info,
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Wand2,
  Sparkles,
  Rocket
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import { toast } from "sonner";

const templateEnum = z.enum([
  "custom", "welcome", "summary", "notification", 
  "abandoned-cart", "order-confirmation", "shipping-update", "product-care"
]);

const formSchema = z.object({
  variableName: z.string().min(1, "Variable name is required").regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
    message: "Must start with letter/underscore and contain only letters, numbers, underscores"
  }),
  credentialId: z.string().min(1, "Resend credential is required"),
  from: z.string().email("Must be a valid email"),
  fromName: z.string().optional(),
  to: z.string().min(1, "Recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  template: templateEnum,
  templateData: z.string().optional(),
  html: z.string().optional(),
}).refine((data) => {
  if (data.template === "custom") return !!data.html;
  return true;
}, {
  message: "HTML content is required for custom template",
  path: ["html"],
});

export type EmailFormValues = z.infer<typeof formSchema>;

const TEMPLATES = [
  { id: "custom", label: "Custom", icon: Code2, desc: "Write your own HTML" },
  { id: "welcome", label: "Welcome", icon: Mail, desc: "New user onboarding" },
  { id: "order-confirmation", label: "Order", icon: Box, desc: "Purchase confirmation" },
  { id: "abandoned-cart", label: "Recovery", icon: Zap, desc: "Abandoned cart" },
  { id: "summary", label: "Summary", icon: Terminal, desc: "Workflow results" },
];

const TEMPLATE_EXAMPLES = {
  welcome: `{
  "name": "{{user.name}}",
  "dashboardUrl": "https://app.vivelune.com/dashboard"
}`,
  summary: `{
  "name": "{{user.name}}",
  "summary": "{{ai.text}}",
  "workflowName": "{{workflow.name}}",
  "executionId": "{{execution.id}}"
}`,
  notification: `{
  "name": "{{user.name}}",
  "message": "{{workflow.name}} completed",
  "actionUrl": "{{execution.url}}"
}`,
  "abandoned-cart": `{
  "name": "{{user.name}}",
  "itemCount": "{{cart.itemCount}}",
  "items": "{{json cart.items}}"
}`,
  "order-confirmation": `{
  "name": "{{user.name}}",
  "orderId": "{{order.id}}",
  "total": "{{order.total}}",
  "items": "{{json order.items}}"
}`,
  "shipping-update": `{
  "name": "{{user.name}}",
  "trackingUrl": "{{order.trackingUrl}}",
  "carrier": "{{order.carrier}}"
}`,
  "product-care": `{
  "name": "{{user.name}}",
  "productName": "{{product.name}}",
  "material": "{{product.material}}"
}`,
  custom: `<h1>Hello {{user.name}}</h1>
<p>Your message: {{ai.text}}</p>`
};

const HELPER_EXAMPLES = [
  { name: "user.email", desc: "User's email address" },
  { name: "user.name", desc: "User's full name" },
  { name: "workflow.name", desc: "Current workflow name" },
  { name: "execution.id", desc: "Execution ID" },
  { name: "ai.text", desc: "AI-generated text" },
  { name: "order.total", desc: "Order total" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EmailFormValues) => void;
  defaultValues?: Partial<EmailFormValues>;
}

export const EmailDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const { data: credentials } = useCredentialsByType(CredentialType.RESEND);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultValues.template || "custom");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"compose" | "preview" | "help">("compose");

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "dispatch",
      credentialId: defaultValues.credentialId || "",
      from: defaultValues.from || "hello@vivelune.com",
      fromName: defaultValues.fromName || "Vivelune",
      to: defaultValues.to || "",
      subject: defaultValues.subject || "",
      template: (defaultValues.template as any) || "custom",
      templateData: defaultValues.templateData || "",
      html: defaultValues.html || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      setSelectedTemplate(defaultValues.template || "custom");
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "dispatch";
  const watchTo = form.watch("to") || "recipient@example.com";
  const watchSubject = form.watch("subject") || "Your subject";
  const watchFrom = form.watch("from") || "sender@example.com";
  const watchFromName = form.watch("fromName") || "Vivelune";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard");
  };

  const insertExample = () => {
    const example = TEMPLATE_EXAMPLES[selectedTemplate as keyof typeof TEMPLATE_EXAMPLES];
    if (selectedTemplate === "custom") {
      form.setValue("html", example);
    } else {
      form.setValue("templateData", example);
    }
    toast.success("Example loaded");
  };

  const validateAndSubmit = (values: EmailFormValues) => {
    onSubmit(values);
    toast.success("Email configuration saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[95vw] p-0 flex flex-col overflow-hidden border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_0_50px_-12px_rgba(249,115,22,0.15)]">
        
        {/* HEADER */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-950/50 shrink-0">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500">
              <Mail className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                Email Dispatch
                <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-orange-500/30 text-orange-500 bg-orange-500/5">
                  v2.0
                </Badge>
              </DialogTitle>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Activity className="size-2.5" />
                Protocol_Ready
              </p>
            </div>
          </div>

         
        </div>

        {/* TABS */}
        <div className="px-6 pt-2 border-b border-zinc-800/50 shrink-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full flex flex-col min-h-0">
                      <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
              <TabsTrigger value="compose" className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Compose
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Preview
              </TabsTrigger>
              <TabsTrigger value="help" className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Help
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Form {...form}>
          {/* THE FIX: flex-1 and min-h-0 allows this container to shrink, enabling the ScrollArea below */}
          <form onSubmit={form.handleSubmit(validateAndSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* MAIN CONTENT */}
            <ScrollArea className="flex-1 w-full">
                            <div className="p-6 space-y-8">
                
                {activeTab === "compose" && (
                  <>
                    {/* CREDENTIAL SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="credentialId" render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="flex items-center gap-2 text-orange-500/70">
                            <Key className="size-3" />
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest">Resend_Credential</FormLabel>
                          </div>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs text-zinc-300 focus:border-orange-500/50">
                                <SelectValue placeholder="Select API Key" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                              {credentials?.length === 0 ? (
                                <div className="p-4 text-center">
                                  <p className="text-xs text-zinc-500">No credentials found</p>
                                  <Button variant="link" size="sm" className="mt-2 text-orange-500" onClick={() => window.open("/credentials/new?type=RESEND", "_blank")}>
                                    Create one
                                  </Button>
                                </div>
                              ) : (
                                credentials?.map((c: any) => (
                                  <SelectItem key={c.id} value={c.id} className="text-xs">
                                    {c.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] text-red-400" />
                        </FormItem>
                      )} />

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
                            Reference: <code className="bg-zinc-800 px-1 py-0.5 rounded text-orange-500">{`{{${field.value}.sent}}`}</code>
                          </FormDescription>
                          <FormMessage className="text-[10px] text-red-400" />
                        </FormItem>
                      )} />
                    </div>

                    {/* ROUTING SECTION */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-orange-500/70">
                        <SendHorizontal className="size-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Routing</span>
                      </div>
                      
                      <div className="space-y-4 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="fromName" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[9px] text-zinc-500 font-bold uppercase">Sender_Name</FormLabel>
                              <FormControl>
                                <Input className="bg-zinc-950 border-zinc-800 rounded-lg h-10 text-[11px]" {...field} />
                              </FormControl>
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="from" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[9px] text-zinc-500 font-bold uppercase">Sender_Email</FormLabel>
                              <FormControl>
                                <Input className="bg-zinc-950 border-zinc-800 rounded-lg h-10 text-[11px] font-mono" {...field} />
                              </FormControl>
                              <FormMessage className="text-[9px]" />
                            </FormItem>
                          )} />
                        </div>

                        <FormField control={form.control} name="to" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[9px] text-zinc-500 font-bold uppercase">Recipient</FormLabel>
                            <FormControl>
                              <Input className="bg-zinc-950 border-zinc-800 rounded-lg h-10 text-[11px] font-mono" placeholder="user@example.com or {{user.email}}" {...field} />
                            </FormControl>
                            <FormDescription className="text-[9px] text-zinc-600">
                              Use variables like <code className="bg-zinc-800 px-1 rounded">&#123;&#123;user.email&#125;&#125;</code>
                            </FormDescription>
                            <FormMessage className="text-[9px]" />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    {/* TEMPLATE SECTION */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/70">Template</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={insertExample}
                          className="h-7 text-[9px] text-orange-500 hover:text-orange-400"
                        >
                          <Wand2 className="size-3 mr-1" />
                          Load example
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {TEMPLATES.map((t) => (
                          <TooltipProvider key={t.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedTemplate(t.id); form.setValue("template", t.id as any); }}
                                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                                    selectedTemplate === t.id 
                                    ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
                                    : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                  }`}
                                >
                                  <t.icon className="size-4" />
                                  <span className="text-[8px] font-black uppercase tracking-tighter">{t.label}</span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs">
                                <p>{t.desc}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="space-y-4">
                      <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] text-zinc-500 font-bold uppercase">Subject</FormLabel>
                          <FormControl>
                            <Input className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-sm text-zinc-100" placeholder="Welcome {{user.name}}!" {...field} />
                          </FormControl>
                          <FormMessage className="text-[9px]" />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name={selectedTemplate === "custom" ? "html" : "templateData"} render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-2">
                            <FormLabel className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                              {selectedTemplate === "custom" ? "HTML Content" : "JSON Data"}
                            </FormLabel>
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-mono text-zinc-600">
                                {selectedTemplate === "custom" ? "text/html" : "application/json"}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(field.value || "", "content")}
                              >
                                {copied === "content" ? (
                                  <CheckCircle2 className="size-3 text-green-500" />
                                ) : (
                                  <Copy className="size-3 text-zinc-500" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <FormControl>
                            <Textarea 
                              className="min-h-[250px] border-zinc-800 rounded-xl font-mono text-xs bg-zinc-900/30 text-zinc-300 p-4 leading-relaxed resize-none focus:border-orange-500/30 transition-colors" 
                              placeholder={selectedTemplate === "custom" 
                                ? '<h1>Hello {{user.name}}</h1>' 
                                : '{\n  "name": "{{user.name}}"\n}'}
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription className="text-[9px] text-zinc-600">
                            Use <code className="bg-zinc-800 px-1 rounded">&#123;&#123;variable&#125;&#125;</code> for values, <code className="bg-zinc-800 px-1 rounded">&#123;&#123;json variable&#125;&#125;</code> for objects
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </>
                )}

                {activeTab === "preview" && (
                  <div className="space-y-6">
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
                      <div className="space-y-3 mb-4 pb-4 border-b border-zinc-800">
                        <div className="text-[10px] text-zinc-600">Message Preview</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-zinc-600">From:</span> {watchFromName} &lt;{watchFrom}&gt;</div>
                          <div><span className="text-zinc-600">To:</span> {watchTo}</div>
                          <div className="col-span-2"><span className="text-zinc-600">Subject:</span> {watchSubject}</div>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-400 min-h-[200px] border border-zinc-800">
                        {selectedTemplate === "custom" ? (
                          form.watch("html") || "<!-- No content yet -->"
                        ) : (
                          <pre className="whitespace-pre-wrap">{form.watch("templateData") || "// No data yet"}</pre>
                        )}
                      </div>

                      <div className="mt-4 text-[9px] text-zinc-600 text-center">
                        Variables will be replaced at runtime
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "help" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-orange-500 flex items-center gap-2">
                        <Code2 className="size-4" />
                        Available Variables
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {HELPER_EXAMPLES.map((ex) => (
                          <div key={ex.name} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <code className="text-xs text-orange-500 font-mono">{`{{${ex.name}}}`}</code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(`{{${ex.name}}}`, ex.name)}
                              >
                                {copied === ex.name ? (
                                  <CheckCircle2 className="size-3 text-green-500" />
                                ) : (
                                  <Copy className="size-3 text-zinc-500" />
                                )}
                              </Button>
                            </div>
                            <p className="text-[10px] text-zinc-500">{ex.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-orange-500 flex items-center gap-2">
                        <Wand2 className="size-4" />
                        Handlebars Helpers
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: "if", desc: "Conditional content", example: "{{#if user.name}}Hello{{/if}}" },
                          { name: "unless", desc: "Inverse condition", example: "{{#unless user.name}}Guest{{/unless}}" },
                          { name: "each", desc: "Loop through arrays", example: "{{#each items}}{{this}}{{/each}}" },
                          { name: "json", desc: "Format as JSON", example: "{{json object}}" },
                        ].map((helper) => (
                          <div key={helper.name} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
                            <code className="text-xs text-orange-500 font-mono">{`{{${helper.name}}}`}</code>
                            <p className="text-[10px] text-zinc-500 mt-1">{helper.desc}</p>
                            <code className="text-[8px] bg-zinc-800 px-1 py-0.5 rounded block mt-2 text-zinc-400">
                              {helper.example}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Alert className="bg-orange-500/5 border-orange-500/20">
                      <BookOpen className="size-4 text-orange-500" />
                      <AlertDescription className="text-xs text-zinc-400">
                        Need more help? Check our{" "}
                        <a href="/docs/email" className="text-orange-500 hover:underline" target="_blank" rel="noopener noreferrer">
                          email documentation
                        </a>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-950/50 shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-3.5 text-orange-500/50" />
                <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Encrypted</span>
                <Separator orientation="vertical" className="h-4 bg-zinc-800" />
                <span className="text-[8px] text-zinc-600 font-mono">v2.0</span>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)} 
                  className="text-[10px] font-black uppercase text-zinc-500 hover:text-white h-9 px-4"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/10 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Rocket className="size-3.5" />
                  Deploy
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};