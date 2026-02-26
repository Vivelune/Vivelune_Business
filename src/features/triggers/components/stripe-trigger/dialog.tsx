// src/features/triggers/components/stripe-trigger/dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon, EyeIcon, ExternalLinkIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({
  open,
  onOpenChange,
}: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const [showExample, setShowExample] = useState(false);

  const baseUrl = process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_APP_URL_DEVELOPMENT
    : process.env.NEXT_PUBLIC_APP_URL;
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const copyExampleData = async () => {
    const exampleData = {
      amount: 10000,
      currency: "usd",
      customerId: "cus_U32ItpQ6M9FKjR",
      customerEmail: "customer@example.com",
      customerName: "John Doe",
      eventType: "checkout.session.completed",
      status: "complete",
      metadata: {
        userId: "user_123",
        plan: "pro"
      }
    };
    await navigator.clipboard.writeText(JSON.stringify(exampleData, null, 2));
    toast.success("Example data copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Stripe Dashboard to trigger
            this workflow on payment events.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Webhook URL Section */}
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-base font-semibold">
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <Button 
                type="button" 
                size="icon" 
                variant="outline" 
                onClick={copyToClipboard}
                className="shrink-0"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Copy this URL and paste it in your Stripe webhook configuration
            </p>
          </div>

          {/* Quick Setup Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              <p className="font-medium mb-1">🚀 Quick Setup Tip:</p>
              <p className="text-sm">
                In Stripe Dashboard, go to Developers → Webhooks → Add Endpoint. 
                Paste the URL above and select the events you want to listen for.
              </p>
            </AlertDescription>
          </Alert>

          {/* Setup Instructions Tabs */}
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Setup Guide</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            {/* Setup Guide Tab */}
            <TabsContent value="setup" className="space-y-4 mt-4">
              <div className="rounded-lg border p-4 space-y-4">
                <h4 className="font-medium">Step-by-Step Instructions:</h4>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">1</span>
                    <span><strong>Open Stripe Dashboard</strong> - Go to <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">dashboard.stripe.com</a></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">2</span>
                    <span><strong>Navigate to Webhooks</strong> - Developers → Webhooks</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">3</span>
                    <span><strong>Add Endpoint</strong> - Click "Add Endpoint" button</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">4</span>
                    <span><strong>Paste URL</strong> - Enter the webhook URL copied above</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">5</span>
                    <span><strong>Select Events</strong> - Choose events to listen for (recommended: checkout.session.completed, customer.subscription.created)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">6</span>
                    <span><strong>Save & Get Secret</strong> - Save the endpoint and copy the signing secret to your .env file</span>
                  </li>
                </ol>
              </div>
            </TabsContent>

            {/* Variables Tab */}
            <TabsContent value="variables" className="space-y-4 mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="basic">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">📊 Basic Variables</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-2">
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.amount}}"}</div>
                        <div className="col-span-3 text-xs">Payment amount in cents (e.g., 10000 = $100.00)</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.currency}}"}</div>
                        <div className="col-span-3 text-xs">Currency code (e.g., "usd", "eur")</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.customerId}}"}</div>
                        <div className="col-span-3 text-xs">Stripe customer ID</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.eventType}}"}</div>
                        <div className="col-span-3 text-xs">Event type (checkout.session.completed, etc.)</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.status}}"}</div>
                        <div className="col-span-2 text-xs">Payment status (complete, pending, failed)</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="customer">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">👤 Customer Details</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-2">
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.customerEmail}}"}</div>
                        <div className="col-span-3 text-xs">Customer's email address</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.customerName}}"}</div>
                        <div className="col-span-3 text-xs">Customer's full name</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.fullData.customer_details.address.country}}"}</div>
                        <div className="col-span-3 text-xs">Customer's country (from shipping/billing)</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="metadata">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">🏷️ Metadata (Your Custom Data)</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-2">
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.metadata.userId}}"}</div>
                        <div className="col-span-3 text-xs">Your internal user ID (if passed)</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{stripe.metadata.plan}}"}</div>
                        <div className="col-span-3 text-xs">Plan name or ID</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{json stripe.metadata}}"}</div>
                        <div className="col-span-3 text-xs">All metadata as JSON</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="full">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">📦 Full Data</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-2">
                      <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{json stripe}}"}</div>
                        <div className="col-span-2 text-xs">Complete Stripe event data as JSON</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-mono text-xs bg-muted p-2 rounded">{"{{json stripe.fullData}}"}</div>
                        <div className="col-span-2 text-xs">Full Stripe session/object data</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Examples Tab */}
            <TabsContent value="examples" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Order Confirmation Email Example</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`{
  "name": "{{stripe.customerName}}",
  "orderId": "{{stripe.id}}",
  "total": "{{stripe.amount}}",
  "customerEmail": "{{stripe.customerEmail}}",
  "items": [
    {
      "name": "Premium Plan",
      "quantity": 1,
      "price": "{{stripe.amount}}"
    }
  ]
}`}
                  </pre>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(`{
  "name": "{{stripe.customerName}}",
  "orderId": "{{stripe.id}}",
  "total": "{{stripe.amount}}",
  "customerEmail": "{{stripe.customerEmail}}"
}`);
                      toast.success("Template copied!");
                    }}
                  >
                    <CopyIcon className="h-3 w-3 mr-2" />
                    Copy Template
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Welcome Email with Metadata</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`{
  "name": "{{stripe.customerName}}",
  "plan": "{{stripe.metadata.plan}}",
  "userId": "{{stripe.metadata.userId}}",
  "dashboardUrl": "https://app.roastandrecover.com/dashboard"
}`}
                  </pre>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Need more examples? Copy the full event data to explore.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyExampleData}
                  >
                    <CopyIcon className="h-3 w-3 mr-2" />
                    Copy Example Data
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Testing Instructions */}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <ExternalLinkIcon className="h-4 w-4" />
              Testing Your Webhook
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Use Stripe's CLI to test locally, or send test events from the Stripe Dashboard.
            </p>
            <div className="text-xs space-y-1">
              <p><strong>Stripe CLI:</strong> <code className="bg-background px-1 py-0.5 rounded">stripe trigger checkout.session.completed</code></p>
              <p><strong>Test Card:</strong> 4242 4242 4242 4242 (any expiry, any CVC)</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};