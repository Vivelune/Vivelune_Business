// src/features/executions/components/email/dialog.tsx
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
import { InfoIcon, MailIcon, CopyIcon } from "lucide-react";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";
import { toast } from "sonner";

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
  const watchTemplate = form.watch("template");

  // Template examples with instructions
  const templateInstructions = {
    "abandoned-cart": {
      description: "Send when a customer leaves items in their cart",
      example: `{
  "name": "&#123;&#123;user.name&#125;&#125;",
  "cartUrl": "https://roastandrecover.com/cart/&#123;&#123;cart.id&#125;&#125;",
  "itemCount": "&#123;&#123;cart.itemCount&#125;&#125;",
  "itemNames": "&#123;&#123;json cart.items&#125;&#125;"
}`,
      tips: "Use itemCount and itemNames to personalize the cart contents"
    },
    "order-confirmation": {
      description: "Send immediately after a successful purchase",
      example: `{
  "name": "&#123;&#123;user.name&#125;&#125;",
  "orderId": "&#123;&#123;order.id&#125;&#125;",
  "total": "&#123;&#123;order.total&#125;&#125;",
  "items": "&#123;&#123;json order.items&#125;&#125;",
  "estimatedDelivery": "&#123;&#123;order.estimatedDelivery&#125;&#125;",
  "trackingUrl": "&#123;&#123;order.trackingUrl&#125;&#125;"
}`,
      tips: "Items array should include name, quantity, and price for each product"
    },
    "shipping-update": {
      description: "Send when the order ships or tracking updates",
      example: `{
  "name": "&#123;&#123;user.name&#125;&#125;",
  "trackingUrl": "&#123;&#123;order.trackingUrl&#125;&#125;",
  "carrier": "&#123;&#123;order.carrier&#125;&#125;",
  "estimatedDelivery": "&#123;&#123;order.estimatedDelivery&#125;&#125;",
  "orderId": "&#123;&#123;order.id&#125;&#125;"
}`,
      tips: "Carrier can be FedEx, UPS, USPS, etc."
    },
    "product-care": {
      description: "Send after delivery with care instructions",
      example: `{
  "name": "&#123;&#123;user.name&#125;&#125;",
  "productName": "&#123;&#123;product.name&#125;&#125;",
  "material": "&#123;&#123;product.material&#125;&#125;",
  "careGuideUrl": "https://roastandrecover.com/care/&#123;&#123;product.slug&#125;&#125;"
}`,
      tips: "Material can be: titanium, walnut, glass, or ceramic"
    },
    "welcome": {
      description: "Send to new users after signup",
      example: `{
  "name": "&#123;&#123;user.name&#125;&#125;",
  "dashboardUrl": "https://roastandrecover.com/dashboard"
}`,
      tips: "Welcome new customers to the Roast & Recover community"
    },
    "summary": {
      description: "Workflow execution summary",
      example: `{
  "name": "&#123;&#123;user.name&#125;&#125;",
  "summary": "&#123;&#123;ai.text&#125;&#125;",
  "workflowName": "&#123;&#123;workflow.name&#125;&#125;",
  "executionId": "&#123;&#123;execution.id&#125;&#125;",
  "appUrl": "https://roastandrecover.com"
}`,
      tips: "Great for AI-generated summaries or reports"
    },
    "notification": {
      description: "General notifications and alerts",
      example: `{
  "name": "&#123;&#123;user.name&#125;&#125;",
  "message": "Your task '&#123;&#123;task.name&#125;&#125;' requires attention",
  "actionUrl": "https://roastandrecover.com/tasks/&#123;&#123;task.id&#125;&#125;",
  "actionText": "View Task"
}`,
      tips: "Use actionUrl and actionText to create call-to-action buttons"
    },
    "custom": {
      description: "Write your own HTML email",
      example: `<h1>Hello &#123;&#123;user.name&#125;&#125;</h1>\n<p>Here's your custom message: &#123;&#123;ai.text&#125;&#125;</p>`,
      tips: "Use HTML tags and CSS inline styles for formatting"
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSubmit = (values: EmailFormValues) => {
    // Combine from and fromName
    const fromEmail = values.fromName 
      ? `${values.fromName} <${values.from}>` 
      : values.from;
    
    onSubmit({
      ...values,
      from: fromEmail,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MailIcon className="h-5 w-5" />
            Send Email
          </DialogTitle>
          <DialogDescription>
            Configure the email to send. First, add your Resend API key in Credentials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Credential Selection */}
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resend API Credential</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingCredentials}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Resend API credential" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentials?.length === 0 ? (
                        <div className="p-2 text-center">
                          <p className="text-sm text-muted-foreground">No Resend credentials found</p>
                          <Button 
                            type="button"
                            variant="link" 
                            className="mt-2" 
                            onClick={() => window.open("/credentials/new", "_blank")}
                          >
                            Create one in Credentials
                          </Button>
                        </div>
                      ) : (
                        credentials?.map((credential) => (
                          <SelectItem key={credential.id} value={credential.id}>
                            <div className="flex items-center gap-2">
                              <Image
                                src="/resend.svg"
                                alt="Resend"
                                width={16}
                                height={16}
                              />
                              {credential.name}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    <span className="flex items-center gap-1">
                      <InfoIcon className="h-3 w-3" />
                      Add your Resend API key in{" "}
                      <a href="/credentials" className="underline" target="_blank" rel="noopener noreferrer">
                        Credentials
                      </a>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="myEmail" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">{`{{${watchVariableName}.sent}}`}</code>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Roast & Recover" {...field} />
                    </FormControl>
                    <FormDescription>Display name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Email</FormLabel>
                    <FormControl>
                      <Input placeholder="hello@roastandrecover.com" {...field} />
                    </FormControl>
                    <FormDescription>Must be verified in Resend</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="customer@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use <code className="bg-muted px-1 rounded">{`{{variable}}`}</code> for dynamic emails
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
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your order #&#123;&#123;order.id&#125;&#125; is confirmed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Template</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedTemplate(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="custom">✏️ Custom HTML</SelectItem>
                      <SelectItem value="welcome">👋 Welcome Email</SelectItem>
                      <SelectItem value="abandoned-cart">🛒 Abandoned Cart</SelectItem>
                      <SelectItem value="order-confirmation">✅ Order Confirmation</SelectItem>
                      <SelectItem value="shipping-update">📦 Shipping Update</SelectItem>
                      <SelectItem value="product-care">🔧 Product Care</SelectItem>
                      <SelectItem value="summary">📊 Workflow Summary</SelectItem>
                      <SelectItem value="notification">🔔 Notification</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Template Instructions */}
            {selectedTemplate && selectedTemplate !== "custom" && (
              <Alert className="bg-muted/50 border-muted">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">{templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.description}</p>
                    <p className="text-sm text-muted-foreground">{templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.tips}</p>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">Example Data:</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => copyToClipboard(templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.example)}
                        >
                          <CopyIcon className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="mt-2 p-3 bg-background rounded-md text-xs overflow-x-auto">
                        {templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.example}
                      </pre>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {selectedTemplate !== "custom" && (
              <FormField
                control={form.control}
                name="templateData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Data (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={templateInstructions[selectedTemplate as keyof typeof templateInstructions]?.example}
                        className="min-h-[150px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide JSON data for the template. Use <code className="bg-muted px-1 rounded">{`{{variable}}`}</code> from previous nodes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedTemplate === "custom" && (
              <FormField
                control={form.control}
                name="html"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTML Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`<h1>Hello &#123;&#123;user.name&#125;&#125;</h1>\n<p>Your order #&#123;&#123;order.id&#125;&#125; has shipped!</p>`}
                        className="min-h-[200px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write your own HTML. Use <code className="bg-muted px-1 rounded">{`{{variable}}`}</code> for dynamic content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="submit">Send Email</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};