// src/features/triggers/components/clerk/dialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  InfoIcon, 
  CopyIcon,
  UserIcon,
  CodeIcon,
  LightbulbIcon,
  AlertTriangleIcon,
  KeyIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { WebhookSecretSelector } from "@/features/credentials/components/webhook-secret-selector";

const EVENT_TYPES = [
  'user.created',
  'user.updated',
  'user.deleted',
  'session.created',
  'session.ended',
  'email.created'
] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),
  eventType: z.enum(EVENT_TYPES),
  includeMetadata: z.boolean(),
  includeUserData: z.boolean(),
  secretId: z.string().optional(),
});

export type ClerkFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClerkFormValues) => void;
  defaultValues?: Partial<ClerkFormValues>;
}

export const ClerkTriggerDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const baseUrl = process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_APP_URL_DEVELOPMENT
    : process.env.NEXT_PUBLIC_APP_URL;

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
  const watchSecretId = form.watch("secretId");
  
  const webhookUrl = `${baseUrl}/api/webhooks/clerk-trigger?workflowId=${workflowId}&variableName=${watchVariableName}${watchSecretId ? `&secretId=${watchSecretId}` : ''}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const copyExample = async (example: string) => {
    try {
      await navigator.clipboard.writeText(example);
      toast.success("Example copied to clipboard");
    } catch {
      toast.error("Failed to copy example");
    }
  };

  const eventDescriptions: Record<string, string> = {
    'user.created': 'Triggered when a new user signs up',
    'user.updated': 'Triggered when user profile is updated',
    'user.deleted': 'Triggered when a user account is deleted',
    'session.created': 'Triggered when a user logs in',
    'session.ended': 'Triggered when a user logs out',
    'email.created': 'Triggered when a new email is added',
  };

  const handleSubmit = (values: ClerkFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Clerk Trigger Configuration
          </DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Clerk Dashboard to trigger workflows on user events.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Webhook URL */}
            <div className="space-y-2">
              <FormLabel className="text-base font-semibold">Webhook URL</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={webhookUrl}
                  readOnly
                  className="font-mono text-sm bg-muted"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  onClick={copyToClipboard}
                >
                  <CopyIcon className="size-4" />
                </Button>
              </div>
              <FormDescription>
                <span className="flex items-center gap-1 text-amber-600">
                  <InfoIcon className="h-3 w-3" />
                  Copy this URL and paste it in your Clerk Dashboard webhook configuration
                </span>
              </FormDescription>
            </div>

            {/* Variable Name - Enhanced Instructions */}
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="clerkEvent" {...field} />
                  </FormControl>
                  <div className="space-y-2 mt-2">
                    <FormDescription>
                      <span className="flex items-start gap-2">
                        <LightbulbIcon className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          This name determines how you'll access the data in other nodes. 
                          For example, if you set this to <code className="bg-muted px-1 py-0.5 rounded">userData</code>, 
                          you'll use <code className="bg-muted px-1 py-0.5 rounded">{`{{userData.firstName}}`}</code>
                        </span>
                      </span>
                    </FormDescription>
                    
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription className="text-blue-800 text-xs">
                        <p className="font-medium mb-1">📝 Current setting:</p>
                        <p>
                          Your data will be available as <code className="bg-blue-100 px-1 py-0.5 rounded">{`{{${watchVariableName}}}`}</code>
                          <br />
                          Example: <code className="bg-blue-100 px-1 py-0.5 rounded">{`{{${watchVariableName}.firstName}}`}</code>
                        </p>
                      </AlertDescription>
                    </Alert>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Type */}
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Event Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user.created">
                        <div className="flex items-center gap-2">
                          <span>👤</span>
                          <span>User Created</span>
                          <Badge variant="outline" className="ml-2">Sign up</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="user.updated">
                        <div className="flex items-center gap-2">
                          <span>🔄</span>
                          <span>User Updated</span>
                          <Badge variant="outline" className="ml-2">Profile change</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="user.deleted">
                        <div className="flex items-center gap-2">
                          <span>🗑️</span>
                          <span>User Deleted</span>
                          <Badge variant="outline" className="ml-2">Account removal</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="session.created">
                        <div className="flex items-center gap-2">
                          <span>🔐</span>
                          <span>Session Created</span>
                          <Badge variant="outline" className="ml-2">Login</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="session.ended">
                        <div className="flex items-center gap-2">
                          <span>🔒</span>
                          <span>Session Ended</span>
                          <Badge variant="outline" className="ml-2">Logout</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="email.created">
                        <div className="flex items-center gap-2">
                          <span>📧</span>
                          <span>Email Created</span>
                          <Badge variant="outline" className="ml-2">New email</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    <span className="flex items-start gap-2">
                      <InfoIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{eventDescriptions[field.value]}</span>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Webhook Secret - NEW SECTION */}
            <FormField
              control={form.control}
              name="secretId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <KeyIcon className="h-4 w-4" />
                    Webhook Secret (Optional)
                  </FormLabel>
                  <WebhookSecretSelector
                    value={field.value}
                    onChange={field.onChange}
                    provider="clerk"
                    placeholder="Select a Clerk webhook secret"
                  />
                  <FormDescription>
                    Select a saved webhook secret to verify incoming Clerk webhooks. 
                    This ensures only genuine Clerk events trigger your workflow.
                    {!field.value && (
                      <span className="block mt-1 text-amber-600">
                        ⚠️ Without a secret, webhooks will not be verified.
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options */}
            <div className="space-y-3">
              <FormLabel className="text-base font-semibold">Data Options</FormLabel>
              <FormField
                control={form.control}
                name="includeUserData"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">Include User Data</FormLabel>
                      <FormDescription>
                        Adds firstName, lastName, email, imageUrl, username to the payload
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeMetadata"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">Include Metadata</FormLabel>
                      <FormDescription>
                        Adds public_metadata, private_metadata, unsafe_metadata to the payload
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Setup Instructions - Enhanced */}
            <Alert className="bg-muted/50 border-muted">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-medium flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                    Setup Instructions
                  </p>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0 mt-0.5">2</span>
                      <span>Go to <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">Clerk Dashboard</a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0 mt-0.5">3</span>
                      <span>Navigate to <strong>Webhooks</strong> section (under Developers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0 mt-0.5">4</span>
                      <span>Click <strong>"Add Endpoint"</strong> and paste the URL above</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0 mt-0.5">5</span>
                      <span>Select events to listen for <span className="text-muted-foreground">(e.g., user.created, session.created)</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0 mt-0.5">6</span>
                      <span>Copy the <strong>Signing Secret</strong> and add it as a <strong>Webhook Secret credential</strong> in the Credentials tab</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0 mt-0.5">7</span>
                      <span>Select the saved secret above to enable webhook verification</span>
                    </li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>

            {/* Available Variables - Enhanced with better examples */}
            <div className="rounded-lg bg-muted p-4 space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <CodeIcon className="h-4 w-4" />
                Available Variables
                <Badge variant="outline" className="ml-2">Using: {watchVariableName}</Badge>
              </h4>
              
              <Tabs defaultValue="variables" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="variables">📋 Variables</TabsTrigger>
                  <TabsTrigger value="examples">💡 Examples</TabsTrigger>
                  <TabsTrigger value="handlebars">🔧 Handlebars</TabsTrigger>
                </TabsList>

                {/* Variables Tab */}
                <TabsContent value="variables" className="mt-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                      <div className="font-mono text-xs bg-background p-2 rounded font-bold">{`{{${watchVariableName}.userId}}`}</div>
                      <div className="col-span-2 text-xs">Clerk User ID <span className="text-green-600">✓ always available</span></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                      <div className="font-mono text-xs bg-background p-2 rounded">{`{{${watchVariableName}.email}}`}</div>
                      <div className="col-span-2 text-xs">User's email address <span className="text-amber-600">⚠️ may be null in test events</span></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                      <div className="font-mono text-xs bg-background p-2 rounded">{`{{${watchVariableName}.firstName}}`}</div>
                      <div className="col-span-2 text-xs">User's first name</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                      <div className="font-mono text-xs bg-background p-2 rounded">{`{{${watchVariableName}.lastName}}`}</div>
                      <div className="col-span-2 text-xs">User's last name</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                      <div className="font-mono text-xs bg-background p-2 rounded">{`{{${watchVariableName}.imageUrl}}`}</div>
                      <div className="col-span-2 text-xs">User's profile image URL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                      <div className="font-mono text-xs bg-background p-2 rounded">{`{{${watchVariableName}.eventType}}`}</div>
                      <div className="col-span-2 text-xs">Type of event (user.created, etc.)</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="font-mono text-xs bg-background p-2 rounded">{`{{json ${watchVariableName}}}`}</div>
                      <div className="col-span-2 text-xs">Full event data as JSON <span className="text-blue-600">🔍 for debugging</span></div>
                    </div>
                  </div>
                </TabsContent>

                {/* Examples Tab */}
                <TabsContent value="examples" className="mt-4">
                  <div className="space-y-4">
                    {/* Basic Usage */}
                    <div className="space-y-2 border rounded-lg p-3">
                      <h5 className="text-sm font-medium flex items-center gap-2">
                        <Badge variant="secondary">Basic</Badge>
                        Simple Greeting
                      </h5>
                      <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`Hello {{${watchVariableName}.firstName}} {{${watchVariableName}.lastName}}!
Your user ID is: {{${watchVariableName}.userId}}`}
                      </pre>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => copyExample(`Hello {{${watchVariableName}.firstName}} {{${watchVariableName}.lastName}}!\nYour user ID is: {{${watchVariableName}.userId}}`)}
                      >
                        <CopyIcon className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>

                    {/* Handling Null Values */}
                    <div className="space-y-2 border rounded-lg p-3">
                      <h5 className="text-sm font-medium flex items-center gap-2">
                        <Badge variant="secondary">Safe</Badge>
                        With Null Checks (Recommended)
                      </h5>
                      <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`{{#if ${watchVariableName}.firstName}}
  Welcome back, {{${watchVariableName}.firstName}}!
{{else}}
  Welcome back, Friend!
{{/if}}

{{#if ${watchVariableName}.email}}
  We've sent a confirmation to {{${watchVariableName}.email}}
{{else}}
  Please verify your email in settings
{{/if}}`}
                      </pre>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => copyExample(`{{#if ${watchVariableName}.firstName}}Welcome back, {{${watchVariableName}.firstName}}!{{else}}Welcome back, Friend!{{/if}}\n\n{{#if ${watchVariableName}.email}}We've sent a confirmation to {{${watchVariableName}.email}}{{else}}Please verify your email in settings{{/if}}`)}
                      >
                        <CopyIcon className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>

                    {/* Welcome Email */}
                    <div className="space-y-2 border rounded-lg p-3">
                      <h5 className="text-sm font-medium flex items-center gap-2">
                        <Badge variant="secondary">Email</Badge>
                        Welcome Email Template
                      </h5>
                      <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`Subject: Welcome to Roast & Recover!

Hello {{#if ${watchVariableName}.firstName}}{{${watchVariableName}.firstName}}{{else}}there{{/if}},

Thank you for joining Roast & Recover. We're excited to have you in our community of ritual enthusiasts.

{{#if ${watchVariableName}.email}}
We'll send updates to {{${watchVariableName}.email}}
{{/if}}

Your account ID: {{${watchVariableName}.userId}}

Start exploring: https://roastandrecover.com/dashboard`}
                      </pre>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => copyExample(`Subject: Welcome to Roast & Recover!\n\nHello {{#if ${watchVariableName}.firstName}}{{${watchVariableName}.firstName}}{{else}}there{{/if}},\n\nThank you for joining Roast & Recover. We're excited to have you in our community of ritual enthusiasts.\n\n{{#if ${watchVariableName}.email}}We'll send updates to {{${watchVariableName}.email}}{{/if}}\n\nYour account ID: {{${watchVariableName}.userId}}\n\nStart exploring: https://roastandrecover.com/dashboard`)}
                      >
                        <CopyIcon className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>

                    {/* Debug */}
                    <div className="space-y-2 border rounded-lg p-3">
                      <h5 className="text-sm font-medium flex items-center gap-2">
                        <Badge variant="secondary">Debug</Badge>
                        View All Data
                      </h5>
                      <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`<pre>{{json ${watchVariableName}}}</pre>`}
                      </pre>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => copyExample(`<pre>{{json ${watchVariableName}}}</pre>`)}
                      >
                        <CopyIcon className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Handlebars Tips Tab */}
                <TabsContent value="handlebars" className="mt-4">
                  <div className="space-y-3">
                    <div className="bg-background p-3 rounded space-y-2">
                      <h5 className="text-sm font-medium flex items-center gap-2">
                        <Badge variant="outline">if/else</Badge>
                        Conditional Logic
                      </h5>
                      <pre className="text-xs bg-muted p-2 rounded">
{`{{#if email}}
  ✅ Has email: {{email}}
{{else}}
  ❌ No email provided
{{/if}}`}
                      </pre>
                    </div>

                    <div className="bg-background p-3 rounded space-y-2">
                      <h5 className="text-sm font-medium flex items-center gap-2">
                        <Badge variant="outline">unless</Badge>
                        Inverse Condition
                      </h5>
                      <pre className="text-xs bg-muted p-2 rounded">
{`{{#unless firstName}}
  Hello Anonymous User
{{/unless}}`}
                      </pre>
                    </div>

                    <div className="bg-background p-3 rounded space-y-2">
                      <h5 className="text-sm font-medium flex items-center gap-2">
                        <Badge variant="outline">json</Badge>
                        Debug Helper
                      </h5>
                      <pre className="text-xs bg-muted p-2 rounded">
{`<details>
  <summary>View Raw Data</summary>
  <pre>{{json this}}</pre>
</details>`}
                      </pre>
                    </div>

                    <Alert className="mt-2 border-amber-200 bg-amber-50">
                      <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-xs text-amber-800">
                        <p className="font-medium mb-1">⚠️ Important:</p>
                        <p>Test events from Clerk often have empty email_addresses arrays. Always use &#123;&#123;#if email&#125;&#125; checks when displaying email data to handle test events gracefully.</p>
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button type="submit" size="lg">Save Configuration</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};