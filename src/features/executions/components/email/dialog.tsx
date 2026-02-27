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
import { InfoIcon, MailIcon, CopyIcon, ShieldCheck } from "lucide-react";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  const templateInstructions = {
    "abandoned-cart": {
      description: "Send when a customer leaves items in their cart",
      example: `{\n  "name": "{{user.name}}",\n  "cartUrl": "https://roastandrecover.com/cart/{{cart.id}}",\n  "itemCount": "{{cart.itemCount}}",\n  "itemNames": "{{json cart.items}}"\n}`,
      tips: "Use itemCount and itemNames to personalize the cart contents"
    },
    "order-confirmation": {
      description: "Send immediately after a successful purchase",
      example: `{\n  "name": "{{user.name}}",\n  "orderId": "{{order.id}}",\n  "total": "{{order.total}}",\n  "items": "{{json order.items}}",\n  "estimatedDelivery": "{{order.estimatedDelivery}}",\n  "trackingUrl": "{{order.trackingUrl}}"\n}`,
      tips: "Items array should include name, quantity, and price for each product"
    },
    "shipping-update": {
      description: "Send when the order ships or tracking updates",
      example: `{\n  "name": "{{user.name}}",\n  "trackingUrl": "{{order.trackingUrl}}",\n  "carrier": "{{order.carrier}}",\n  "estimatedDelivery": "{{order.estimatedDelivery}}",\n  "orderId": "{{order.id}}"\n}`,
      tips: "Carrier can be FedEx, UPS, USPS, etc."
    },
    "product-care": {
      description: "Send after delivery with care instructions",
      example: `{\n  "name": "{{user.name}}",\n  "productName": "{{product.name}}",\n  "material": "{{product.material}}",\n  "careGuideUrl": "https://roastandrecover.com/care/{{product.slug}}"\n}`,
      tips: "Material can be: titanium, walnut, glass, or ceramic"
    },
    "welcome": {
      description: "Send to new users after signup",
      example: `{\n  "name": "{{user.name}}",\n  "dashboardUrl": "https://roastandrecover.com/dashboard"\n}`,
      tips: "Welcome new customers to the Roast & Recover community"
    },
    "summary": {
      description: "Workflow execution summary",
      example: `{\n  "name": "{{user.name}}",\n  "summary": "{{ai.text}}",\n  "workflowName": "{{workflow.name}}",\n  "executionId": "{{execution.id}}",\n  "appUrl": "https://roastandrecover.com"\n}`,
      tips: "Great for AI-generated summaries or reports"
    },
    "notification": {
      description: "General notifications and alerts",
      example: `{\n  "name": "{{user.name}}",\n  "message": "Your task '{{task.name}}' requires attention",\n  "actionUrl": "https://roastandrecover.com/tasks/{{task.id}}",\n  "actionText": "View Task"\n}`,
      tips: "Use actionUrl and actionText to create call-to-action buttons"
    },
    "custom": {
      description: "Write your own HTML email",
      example: `<h1>Hello {{user.name}}</h1>\n<p>Here's your custom message: {{ai.text}}</p>`,
      tips: "Use HTML tags and CSS inline styles for formatting"
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSubmit = (values: EmailFormValues) => {
    const fromEmail = values.fromName 
      ? `${values.fromName} <${values.from}>` 
      : values.from;
    
    onSubmit({ ...values, from: fromEmail });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-none border-[#DCD5CB] bg-[#F4F1EE] p-0 shadow-2xl">
        <div className="h-1.5 bg-[#1C1C1C] w-full" />
        
        <DialogHeader className="p-8 border-b border-[#DCD5CB]">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-[4px] text-[#1C1C1C]">
            <MailIcon className="size-6" />
            Communication Protocol
          </DialogTitle>
          <DialogDescription className="text-[11px] font-medium uppercase tracking-[1px] text-[#8E8E8E] italic mt-2">
            Configure automated dispatch settings via Resend credentials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-8 space-y-10">
            {/* API CREDENTIALS */}
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Resend Vault Access</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCredentials}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-[#DCD5CB] bg-white h-12 uppercase text-[11px] tracking-widest font-bold">
                        <SelectValue placeholder="Select API Key" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-[#DCD5CB]">
                      {credentials?.length === 0 ? (
                        <div className="p-4 text-center">
                          <p className="text-[10px] font-bold uppercase text-[#8E8E8E]">Vault Empty</p>
                          <Button variant="link" className="mt-2 text-[10px] uppercase font-black" onClick={() => window.open("/credentials/new", "_blank")}>Create Credential</Button>
                        </div>
                      ) : (
                        credentials?.map((credential) => (
                          <SelectItem key={credential.id} value={credential.id} className="text-[11px] font-bold uppercase tracking-tight">
                            {credential.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[10px] italic font-medium text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1.5">
                    <InfoIcon className="size-3" />
                    Key management: <a href="/credentials" className="underline" target="_blank">Vault Settings</a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-8 border-t border-[#DCD5CB] pt-10">
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Process Variable</FormLabel>
                    <FormControl>
                      <Input placeholder="email_dispatch" className="rounded-none border-[#DCD5CB] bg-white font-mono text-sm" {...field} />
                    </FormControl>
                    <FormDescription className="text-[10px] italic font-medium text-[#8E8E8E] ">
                      Ref: <code className="bg-[#1C1C1C] text-[#E7E1D8] px-1.5 py-0.5 ml-1">{`{{${watchVariableName}.sent}}`}</code>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Subject Header</FormLabel>
                    <FormControl>
                      <Input placeholder="Order #{{order.id}} Confirmed" className="rounded-none border-[#DCD5CB] bg-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="fromName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Sender Identity</FormLabel>
                    <FormControl>
                      <Input className="rounded-none border-[#DCD5CB] bg-white uppercase text-[11px] font-bold" {...field} />
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
                      <Input className="rounded-none border-[#DCD5CB] bg-white font-mono text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-8 border-t border-[#DCD5CB] pt-10">
              <div className="grid grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Target Recipient</FormLabel>
                      <FormControl>
                        <Input placeholder="{{customer_email}}" className="rounded-none border-[#DCD5CB] bg-white font-mono text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">Ritual Template</FormLabel>
                      <Select onValueChange={(v) => { field.onChange(v); setSelectedTemplate(v); }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none border-[#DCD5CB] bg-white h-12 uppercase text-[11px] tracking-widest font-bold">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-[#DCD5CB]">
                          <SelectItem value="custom" className="uppercase text-[10px] font-bold">Custom HTML</SelectItem>
                          <SelectItem value="welcome" className="uppercase text-[10px] font-bold">Welcome Protocol</SelectItem>
                          <SelectItem value="abandoned-cart" className="uppercase text-[10px] font-bold">Abandoned Cart</SelectItem>
                          <SelectItem value="order-confirmation" className="uppercase text-[10px] font-bold">Confirmation</SelectItem>
                          <SelectItem value="shipping-update" className="uppercase text-[10px] font-bold">Shipping Update</SelectItem>
                          <SelectItem value="product-care" className="uppercase text-[10px] font-bold">Product Care</SelectItem>
                          <SelectItem value="summary" className="uppercase text-[10px] font-bold">Summary</SelectItem>
                          <SelectItem value="notification" className="uppercase text-[10px] font-bold">Notification</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* TEMPLATE GUIDANCE */}
              {selectedTemplate && selectedTemplate !== "custom" && (
                <Alert className="rounded-none border-[#DCD5CB] bg-white/50 p-6">
                  <AlertDescription>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[1px] text-[#1C1C1C]">Instruction</p>
                          <p className="text-[11px] text-[#8E8E8E] font-medium italic">{templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.description}</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="rounded-none h-8 text-[9px] uppercase font-bold tracking-widest border-[#DCD5CB]" onClick={() => copyToClipboard(templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.example)}>
                          <CopyIcon className="size-3 mr-2" /> Copy Payload
                        </Button>
                      </div>
                      <div className="bg-[#1C1C1C] p-4">
                        <pre className="text-[11px] font-mono text-[#E7E1D8] opacity-80 overflow-x-auto leading-relaxed">
                          {templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.example}
                        </pre>
                      </div>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[#8E8E8E]">Tip: {templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.tips}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name={selectedTemplate === "custom" ? "html" : "templateData"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[2px] text-[#1C1C1C]">
                      {selectedTemplate === "custom" ? "Protocol HTML" : "Payload Data (JSON)"}
                    </FormLabel>
                    <FormControl>
                      <Textarea className="rounded-none border-[#DCD5CB] bg-white min-h-[180px] font-mono text-xs leading-relaxed" {...field} />
                    </FormControl>
                    <FormDescription className="text-[10px] italic font-medium text-[#8E8E8E] uppercase">Use curly braces for dynamic variables from preceding nodes.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-8 border-t border-[#DCD5CB]">
              <Button type="submit" className="rounded-none bg-[#1C1C1C] hover:bg-[#333] text-white px-12 h-14 uppercase text-xs font-black tracking-[4px] w-full sm:w-auto transition-all shadow-xl">
                Commit Protocol
              </Button>
            </DialogFooter>
          </form>
        </Form>
        
        <div className="flex items-center justify-center gap-2 p-6 bg-[#F4F1EE] border-t border-[#DCD5CB] opacity-20">
          <ShieldCheck className="size-3 text-[#1C1C1C]" />
          <span className="text-[9px] uppercase tracking-[3px] font-bold text-[#1C1C1C]">End-to-End TLS Encryption Dispatch</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};