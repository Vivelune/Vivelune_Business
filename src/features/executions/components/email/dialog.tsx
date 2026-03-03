"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  InfoIcon, 
  MailIcon, 
  CopyIcon, 
  ShieldCheck,
  LightbulbIcon,
  CodeIcon,
  BookOpenIcon,
  SparklesIcon,
  HelpCircleIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ChevronRightIcon,
  EyeIcon,
  FileTextIcon,
  Wand2Icon,
  RocketIcon,
  UsersIcon,
  ShoppingCartIcon,
  TruckIcon,
  PackageIcon
} from "lucide-react";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Define the enum for templates
const templateEnum = z.enum([
  "custom",
  "welcome",
  "summary",
  "notification",
  "abandoned-cart",
  "order-confirmation",
  "shipping-update",
  "product-care"
]);

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),
  credentialId: z.string().min(1, "Resend API credential is required"),
  from: z.string().email("Must be a valid email"),
  fromName: z.string().optional(),
  to: z.string().min(1, "Recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  template: templateEnum,
  templateData: z.string().optional(),
  html: z.string().optional(),
}).refine((data) => {
  if (data.template === "custom") {
    return !!data.html;
  }
  return true;
}, {
  message: "HTML content is required for custom template",
  path: ["html"],
});

export type EmailFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EmailFormValues) => void;
  defaultValues?: Partial<EmailFormValues>;
}

export const EmailDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultValues.template || "custom");
  const [activeTab, setActiveTab] = useState<"form" | "preview" | "instructions">("form");
  const [showVariableGuide, setShowVariableGuide] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const {
    data: credentials,
    isLoading: isLoadingCredentials,
  } = useCredentialsByType(CredentialType.RESEND);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      credentialId: defaultValues.credentialId || "",
      from: defaultValues.from || "hello@roastandrecover.com",
      fromName: defaultValues.fromName || "Roast & Recover",
      to: defaultValues.to || "",
      subject: defaultValues.subject || "",
      template: defaultValues.template || "custom",
      templateData: defaultValues.templateData || "",
      html: defaultValues.html || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        credentialId: defaultValues.credentialId || "",
        from: defaultValues.from || "hello@roastandrecover.com",
        fromName: defaultValues.fromName || "Roast & Recover",
        to: defaultValues.to || "",
        subject: defaultValues.subject || "",
        template: defaultValues.template || "custom",
        templateData: defaultValues.templateData || "",
        html: defaultValues.html || "",
      });
      setSelectedTemplate(defaultValues.template || "custom");
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myEmail";
  const watchSubject = form.watch("subject") || "Your subject here";
  const watchTo = form.watch("to") || "recipient@example.com";
  const watchFrom = form.watch("from") || "sender@example.com";
  const watchFromName = form.watch("fromName") || "Your Brand";

  const templateInstructions = {
    "welcome": {
      icon: UsersIcon,
      color: "bg-blue-500",
      description: "Send to new users after signup",
      example: `{\n  "name": "{{user.name}}",\n  "dashboardUrl": "https://app.vivelune.com/dashboard"\n}`,
      tips: "Welcome new users and guide them to their first workflow",
      preview: {
        subject: "Welcome to Vivelune, {{name}}!",
        body: "We're excited to have you on board. Start building your first workflow today."
      }
    },
    "summary": {
      icon: FileTextIcon,
      color: "bg-purple-500",
      description: "Workflow execution summary",
      example: `{\n  "name": "{{user.name}}",\n  "summary": "{{ai.text}}",\n  "workflowName": "{{workflow.name}}",\n  "executionId": "{{execution.id}}",\n  "appUrl": "https://app.vivelune.com"\n}`,
      tips: "Perfect for AI-generated summaries or daily reports",
      preview: {
        subject: "Workflow Summary: {{workflowName}}",
        body: "Your workflow has completed. Here's what happened..."
      }
    },
    "notification": {
      icon: BellIcon,
      color: "bg-yellow-500",
      description: "General notifications and alerts",
      example: `{\n  "name": "{{user.name}}",\n  "message": "Your workflow '{{workflow.name}}' has completed",\n  "actionUrl": "https://app.vivelune.com/executions/{{execution.id}}",\n  "actionText": "View Results"\n}`,
      tips: "Use for system alerts, task completions, or important updates",
      preview: {
        subject: "Notification: {{message}}",
        body: "{{message}} - Click here to view details"
      }
    },
    "abandoned-cart": {
      icon: ShoppingCartIcon,
      color: "bg-orange-500",
      description: "Send when a customer leaves items in their cart",
      example: `{\n  "name": "{{user.name}}",\n  "cartUrl": "https://store.vivelune.com/cart/{{cart.id}}",\n  "itemCount": "{{cart.itemCount}}",\n  "itemNames": "{{json cart.items}}"\n}`,
      tips: "Personalize with item names and offer a small discount to recover sales",
      preview: {
        subject: "Complete Your Purchase - {{itemCount}} items waiting",
        body: "You left some items in your cart. They're waiting for you!"
      }
    },
    "order-confirmation": {
      icon: CheckCircle2Icon,
      color: "bg-green-500",
      description: "Send immediately after a successful purchase",
      example: `{\n  "name": "{{user.name}}",\n  "orderId": "{{order.id}}",\n  "total": "{{order.total}}",\n  "items": "{{json order.items}}",\n  "estimatedDelivery": "{{order.estimatedDelivery}}",\n  "trackingUrl": "{{order.trackingUrl}}"\n}`,
      tips: "Include order summary and clear next steps for customers",
      preview: {
        subject: "Order Confirmed #{{orderId}}",
        body: "Thank you for your purchase! We're preparing your order."
      }
    },
    "shipping-update": {
      icon: TruckIcon,
      color: "bg-cyan-500",
      description: "Send when the order ships or tracking updates",
      example: `{\n  "name": "{{user.name}}",\n  "trackingUrl": "{{order.trackingUrl}}",\n  "carrier": "{{order.carrier}}",\n  "estimatedDelivery": "{{order.estimatedDelivery}}",\n  "orderId": "{{order.id}}"\n}`,
      tips: "Include tracking links and delivery estimates for transparency",
      preview: {
        subject: "Your Order #{{orderId}} Has Shipped!",
        body: "Good news! Your order is on its way via {{carrier}}."
      }
    },
    "product-care": {
      icon: PackageIcon,
      color: "bg-emerald-500",
      description: "Send after delivery with care instructions",
      example: `{\n  "name": "{{user.name}}",\n  "productName": "{{product.name}}",\n  "material": "{{product.material}}",\n  "careGuideUrl": "https://vivelune.com/care/{{product.slug}}"\n}`,
      tips: "Help customers maintain their products and build loyalty",
      preview: {
        subject: "Caring for Your {{productName}}",
        body: "Here's how to keep your {{productName}} in perfect condition."
      }
    },
    "custom": {
      icon: Wand2Icon,
      color: "bg-gray-500",
      description: "Write your own HTML email",
      example: `<h1>Hello {{user.name}}</h1>\n<p>Here's your custom message: {{ai.text}}</p>\n<a href="{{actionUrl}}">{{actionText}}</a>`,
      tips: "Full control over HTML and styling. Use inline CSS for email compatibility.",
      preview: {
        subject: "{{subject}}",
        body: "Custom HTML content..."
      }
    }
  };

  const copyToClipboard = async (text: string, field?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (field) {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      }
      toast.success("Copied to clipboard", {
        icon: <CheckCircle2Icon className="size-4" />,
        className: "border-[#DCD5CB] bg-[#F4F1EE] text-[#1C1C1C]"
      });
    } catch {
      toast.error("Failed to copy", {
        icon: <AlertTriangleIcon className="size-4" />,
        className: "border-red-200 bg-red-50 text-red-600"
      });
    }
  };

  const handleSubmit = (values: EmailFormValues) => {
    const fromEmail = values.fromName 
      ? `${values.fromName} <${values.from}>` 
      : values.from;
    
    onSubmit({ ...values, from: fromEmail });
    toast.success("Email configuration saved", {
      icon: <RocketIcon className="size-4" />,
      className: "border-[#DCD5CB] bg-[#F4F1EE] text-[#1C1C1C]"
    });
    onOpenChange(false);
  };

  const currentTemplate = templateInstructions[selectedTemplate as keyof typeof templateInstructions];
  const TemplateIcon = currentTemplate?.icon || MailIcon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto rounded-none border-[#DCD5CB] bg-[#F4F1EE] p-0 shadow-2xl">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-linear-to-r from-[#1C1C1C] via-[#4A4A4A] to-[#1C1C1C] w-full" />
        
        {/* Header */}
        <DialogHeader className="p-8 border-b border-[#DCD5CB] bg-white/50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="size-12 bg-[#1C1C1C] flex items-center justify-center">
                <MailIcon className="size-6 text-[#E7E1D8]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-[4px] text-[#1C1C1C] flex items-center gap-2">
                  Communication Protocol
                  <span className="text-[8px] bg-[#E7E1D8] px-2 py-1 tracking-[2px]">v2.0</span>
                </DialogTitle>
                <DialogDescription className="text-[11px] font-medium uppercase tracking-[1px] text-[#8E8E8E] italic mt-2 max-w-xl">
                  Configure automated email dispatch via Resend. Each field supports Handlebars variables from previous nodes.
                </DialogDescription>
              </div>
            </div>
            
            {/* Template Badge */}
            <div className={cn(
              "px-3 py-1 border border-[#DCD5CB] flex items-center gap-2",
              currentTemplate?.color.replace('bg-', 'bg-opacity-10 border-')
            )}>
              <TemplateIcon className="size-3" />
              <span className="text-[9px] uppercase tracking-wider font-bold">
                {selectedTemplate.replace('-', ' ')}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-[#DCD5CB] px-8 pt-2">
          <div className="flex gap-6">
            {[
              { id: "form", label: "Configuration", icon: MailIcon },
              { id: "preview", label: "Live Preview", icon: EyeIcon },
              { id: "instructions", label: "Guide & Examples", icon: BookOpenIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-3 px-1 text-[10px] uppercase tracking-wider font-bold flex items-center gap-2 border-b-2 transition-all",
                  activeTab === tab.id 
                    ? "border-[#1C1C1C] text-[#1C1C1C]" 
                    : "border-transparent text-[#8E8E8E] hover:text-[#4A4A4A]"
                )}
              >
                <tab.icon className="size-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <AnimatePresence mode="wait">
              {/* Configuration Tab */}
              {activeTab === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 space-y-8"
                >
                  {/* Credential Selection with Guide */}
                  <div className="relative">
                    <FormField
                      control={form.control}
                      name="credentialId"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C] flex items-center gap-2">
                            <ShieldCheck className="size-3" />
                            Resend Vault Access
                            <span className="text-[8px] bg-[#E7E1D8] px-2 py-0.5 text-[#1C1C1C]">Required</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCredentials}>
                            <FormControl>
                              <SelectTrigger className="rounded-none border-[#DCD5CB] bg-white h-14 uppercase text-[11px] tracking-widest font-bold">
                                <SelectValue placeholder="Select API Key from Vault" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-none border-[#DCD5CB]">
                              {credentials?.length === 0 ? (
                                <div className="p-6 text-center space-y-3">
                                  <p className="text-[10px] font-bold uppercase text-[#8E8E8E]">🔐 No credentials found</p>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-none text-[9px] uppercase tracking-wider"
                                    onClick={() => window.open("/credentials/new?type=RESEND", "_blank")}
                                  >
                                    Create Resend Credential
                                  </Button>
                                </div>
                              ) : (
                                credentials?.map((credential) => (
                                  <SelectItem key={credential.id} value={credential.id} className="py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="size-6 bg-[#1C1C1C] flex items-center justify-center">
                                        <span className="text-[8px] text-[#E7E1D8]">🔑</span>
                                      </div>
                                      <div>
                                        <p className="text-[11px] font-bold uppercase tracking-tight">{credential.name}</p>
                                        <p className="text-[8px] text-[#8E8E8E]">Resend API Key</p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-[9px] font-medium text-[#8E8E8E] flex items-center gap-1">
                            <InfoIcon className="size-3" />
                            Credentials are encrypted and never exposed in logs
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Two Column Layout for Core Fields */}
                  <div className="grid grid-cols-2 gap-8 border-t border-[#DCD5CB] pt-8">
                    {/* Variable Name with Example */}
                    <FormField
                      control={form.control}
                      name="variableName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C] flex items-center gap-1">
                            Process Variable
                            <HelpCircleIcon className="size-3 text-[#8E8E8E]" />
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="email_dispatch" 
                                className="rounded-none border-[#DCD5CB] bg-white font-mono text-sm pr-20" 
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={() => copyToClipboard(`{{${watchVariableName}.sent}}`, 'variable')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E8E8E] hover:text-[#1C1C1C]"
                              >
                                {copiedField === 'variable' ? (
                                  <CheckCircle2Icon className="size-4" />
                                ) : (
                                  <CopyIcon className="size-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormDescription className="text-[9px] text-[#8E8E8E]">
                            Reference: <code className="bg-[#E7E1D8] px-1 py-0.5 text-[#1C1C1C]">{`{{${watchVariableName}.sent}}`}</code>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subject with Preview */}
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Subject Header</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Order #{{order.id}} Confirmed" 
                              className="rounded-none border-[#DCD5CB] bg-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-[9px] text-[#8E8E8E]">
                            Preview: <span className="font-mono">"{watchSubject.slice(0, 40)}..."</span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* From Fields */}
                  <div className="grid grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Sender Identity</FormLabel>
                          <FormControl>
                            <Input 
                              className="rounded-none border-[#DCD5CB] bg-white uppercase text-[11px] font-bold" 
                              placeholder="Your Brand Name"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Origin Email</FormLabel>
                          <FormControl>
                            <Input 
                              className="rounded-none border-[#DCD5CB] bg-white font-mono text-sm" 
                              placeholder="hello@yourdomain.com"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-[9px] text-[#8E8E8E]">
                            Must be verified in Resend
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Recipient and Template */}
                  <div className="grid grid-cols-2 gap-8 border-t border-[#DCD5CB] pt-8">
                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Target Recipient</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="{{customer.email}}" 
                                className="rounded-none border-[#DCD5CB] bg-white font-mono text-sm pr-20" 
                                {...field} 
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-[#8E8E8E]">
                                Handlebars
                              </span>
                            </div>
                          </FormControl>
                          <FormDescription className="text-[9px] text-[#8E8E8E]">
                            Use variables like <code className="bg-[#E7E1D8] px-1">{`{{user.email}}`}</code>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="template"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C] flex items-center gap-1">
                            Email Template
                            <HelpCircleIcon className="size-3 text-[#8E8E8E]" />
                          </FormLabel>
                          <Select onValueChange={(v) => { field.onChange(v); setSelectedTemplate(v); }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-none border-[#DCD5CB] bg-white h-14">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-none border-[#DCD5CB]">
                              {Object.entries(templateInstructions).map(([key, template]) => (
                                <SelectItem key={key} value={key} className="py-3">
                                  <div className="flex items-center gap-3">
                                    <div className={cn("size-6 flex items-center justify-center", template.color)}>
                                      <template.icon className="size-3 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-[11px] font-bold uppercase tracking-tight">{key.replace('-', ' ')}</p>
                                      <p className="text-[8px] text-[#8E8E8E]">{template.description}</p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Template Content with Live Preview */}
                  <div className="space-y-4 border border-[#DCD5CB] bg-white/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TemplateIcon className="size-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-[2px]">
                          {selectedTemplate === "custom" ? "Custom HTML" : "Template Payload"}
                        </h3>
                      </div>
                      {selectedTemplate !== "custom" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-none h-7 text-[8px] uppercase tracking-wider"
                          onClick={() => copyToClipboard(currentTemplate.example, 'template')}
                        >
                          {copiedField === 'template' ? (
                            <CheckCircle2Icon className="size-3 mr-1" />
                          ) : (
                            <CopyIcon className="size-3 mr-1" />
                          )}
                          Copy Example
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={selectedTemplate === "custom" ? "html" : "templateData"}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              className="rounded-none border-[#DCD5CB] bg-white min-h-[200px] font-mono text-xs leading-relaxed" 
                              placeholder={selectedTemplate === "custom" 
                                ? '<h1>Hello {{user.name}}</h1>\n<p>Your message: {{ai.text}}</p>' 
                                : '{\n  "name": "{{user.name}}",\n  "data": "{{ai.text}}"\n}'}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-[9px] text-[#8E8E8E] flex items-center gap-1">
                            <LightbulbIcon className="size-3" />
                            Use <code className="bg-[#E7E1D8] px-1">{"{{variable}}"}</code> for values,{" "}
                            <code className="bg-[#E7E1D8] px-1">{"{{json variable}}"}</code> for objects
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Quick Tips */}
                  <Alert className="rounded-none border-[#DCD5CB] bg-blue-50/50 p-4">
                    <LightbulbIcon className="size-4 text-blue-600" />
                    <AlertDescription>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-2">💡 Pro Tips</p>
                      <ul className="space-y-1 text-[9px] text-blue-700">
                        <li>• Test with your own email first using <code className="bg-blue-100 px-1">your@email.com</code></li>
                        <li>• Always include an unsubscribe link in marketing emails</li>
                        <li>• Use <code className="bg-blue-100 px-1">{"{{#if variable}}"}</code> for conditional content</li>
                        <li>• Preview in your email client before sending to customers</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Preview Tab */}
              {activeTab === "preview" && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 space-y-6"
                >
                  <div className="bg-white border border-[#DCD5CB] p-6">
                    <div className="border-b border-[#DCD5CB] pb-4 mb-4">
                      <div className="text-[8px] uppercase tracking-wider text-[#8E8E8E] mb-2">Email Preview</div>
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <span className="text-[#8E8E8E]">From:</span>{" "}
                          <span className="font-mono">{watchFromName} &lt;{watchFrom}&gt;</span>
                        </div>
                        <div>
                          <span className="text-[#8E8E8E]">To:</span>{" "}
                          <span className="font-mono">{watchTo}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#8E8E8E]">Subject:</span>{" "}
                          <span className="font-mono font-bold">{watchSubject}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="min-h-[200px] bg-[#F4F1EE] p-4 font-mono text-[11px]">
                      {selectedTemplate === "custom" ? (
                        <pre className="whitespace-pre-wrap">{form.watch("html") || "<!-- Your HTML will appear here -->"}</pre>
                      ) : (
                        <pre className="whitespace-pre-wrap text-[#8E8E8E]">
                          {currentTemplate?.preview.body || "Template preview..."}
                        </pre>
                      )}
                    </div>

                    <div className="mt-4 text-[8px] text-[#8E8E8E] text-center">
                      This is a preview. Variables will be replaced with actual data during execution.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Instructions Tab */}
              {activeTab === "instructions" && (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 space-y-8"
                >
                  {/* Variable Guide */}
                  <div className="border border-[#DCD5CB] bg-white p-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] mb-4 flex items-center gap-2">
                      <CodeIcon className="size-4" />
                      Available Variables
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider mb-2">From Previous Nodes</p>
                        <div className="space-y-1">
                          <code className="block text-[9px] bg-[#E7E1D8] p-1">{`{{${watchVariableName}.sent}}`}</code>
                          <code className="block text-[9px] bg-[#E7E1D8] p-1">{`{{${watchVariableName}.id}}`}</code>
                          <code className="block text-[9px] bg-[#E7E1D8] p-1">{`{{${watchVariableName}.timestamp}}`}</code>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider mb-2">Common Workflow Data</p>
                        <div className="space-y-1">
                          <code className="block text-[9px] bg-[#E7E1D8] p-1">{"{{user.email}}"}</code>
                          <code className="block text-[9px] bg-[#E7E1D8] p-1">{"{{user.name}}"}</code>
                          <code className="block text-[9px] bg-[#E7E1D8] p-1">{"{{workflow.name}}"}</code>
                          <code className="block text-[9px] bg-[#E7E1D8] p-1">{"{{execution.id}}"}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Handlebars Guide */}
                  <div className="border border-[#DCD5CB] bg-white p-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[2px] mb-4 flex items-center gap-2">
                      <Wand2Icon className="size-4" />
                      Handlebars Helpers
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "if", example: "{{#if user.name}}Hello {{user.name}}{{/if}}" },
                        { name: "unless", example: "{{#unless user.name}}Hello Guest{{/unless}}" },
                        { name: "each", example: "{{#each items}}{{this.name}}{{/each}}" },
                        { name: "json", example: "{{json object}}" },
                        { name: "date", example: "{{date timestamp 'MM/DD/YYYY'}}" },
                        { name: "eq", example: "{{#eq status 'active'}}Active{{/eq}}" }
                      ].map((helper) => (
                        <div key={helper.name} className="space-y-1">
                          <code className="text-[9px] bg-[#1C1C1C] text-[#E7E1D8] px-2 py-1">{`{{${helper.name}}}`}</code>
                          <p className="text-[8px] text-[#8E8E8E]">{helper.example}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Template Examples */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[2px]">Template Examples</h3>
                    {Object.entries(templateInstructions).map(([key, template]) => (
                      <div key={key} className="border border-[#DCD5CB] bg-white p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={cn("size-5 flex items-center justify-center", template.color)}>
                              <template.icon className="size-3 text-white" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{key.replace('-', ' ')}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="rounded-none h-6 text-[8px]"
                            onClick={() => copyToClipboard(template.example)}
                          >
                            <CopyIcon className="size-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-[9px] text-[#8E8E8E] mb-2">{template.description}</p>
                        <pre className="text-[8px] bg-[#E7E1D8] p-2 overflow-x-auto">{template.example}</pre>
                        <p className="text-[8px] text-[#8E8E8E] mt-2 italic">💡 {template.tips}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="border-t border-[#DCD5CB] p-6 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[8px] text-[#8E8E8E]">
                  <ShieldCheck className="size-3" />
                  End-to-end encrypted
                </div>
                <div className="flex items-center gap-2 text-[8px] text-[#8E8E8E]">
                  <SparklesIcon className="size-3" />
                  Powered by Resend
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="rounded-none border-[#DCD5CB] text-[10px] uppercase tracking-wider font-bold h-12 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-none bg-[#1C1C1C] hover:bg-[#333] text-white px-8 h-12 uppercase text-[10px] font-black tracking-wider flex items-center gap-2"
                >
                  Save Protocol
                  <RocketIcon className="size-3" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Missing icon components
const BellIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);