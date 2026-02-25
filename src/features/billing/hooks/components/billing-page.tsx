// src/features/billing/components/billing-page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import {
  CreditCard,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useBillingPortal, useCancelSubscription, useInvoices, useSubscription } from '../use-billing';

export function BillingPage() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const { data: subData, isLoading: subLoading } = useSubscription();
  const { data: invData, isLoading: invLoading } = useInvoices();
  const portalMutation = useBillingPortal();
  const cancelMutation = useCancelSubscription();

  const subscription = subData?.subscription;
  const invoices = invData?.invoices || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Canceled</Badge>;
      case 'incomplete':
        return <Badge variant="outline">Incomplete</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500">Trial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleCancelSubscription = async () => {
    await cancelMutation.mutateAsync(true);
    setShowCancelDialog(false);
  };

  const handleReactivateSubscription = async () => {
    await cancelMutation.mutateAsync(false);
  };

  if (!subscription && !subLoading) {
    return (
      <div className="p-4 md:px-10 md:py-6">
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription. Upgrade to Pro to unlock all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => portalMutation.mutate()}>
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:px-10 md:py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and view billing history
          </p>
        </div>
        <Button
          onClick={() => portalMutation.mutate()}
          disabled={portalMutation.isPending}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Manage Payment Methods
        </Button>
      </div>

      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your subscription details and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{subscription.plan.name}</h3>
                  <p className="text-2xl font-bold">
                    {formatCurrency(subscription.plan.amount, subscription.plan.currency)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{subscription.plan.interval}
                    </span>
                  </p>
                </div>
                <div>{getStatusBadge(subscription.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Period</p>
                  <p className="font-medium">
                    {format(new Date(subscription.currentPeriodStart), 'MMM d, yyyy')} -{' '}
                    {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                  </p>
                </div>
                {subscription.paymentMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">
                      {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
                      <span className="text-sm text-muted-foreground ml-2">
                        Exp {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {subscription.cancelAtPeriodEnd && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your subscription will end on{' '}
                    {format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy')}.
                    You can reactivate it before then to continue uninterrupted.
                  </AlertDescription>
                </Alert>
              )}

              {subscription.upcomingInvoice && !subscription.cancelAtPeriodEnd && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Next payment of{' '}
                    {formatCurrency(subscription.upcomingInvoice.amount, subscription.upcomingInvoice.currency)}{' '}
                    will be charged on{' '}
                    {format(new Date(subscription.upcomingInvoice.date), 'MMMM d, yyyy')}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                {!subscription.cancelAtPeriodEnd ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={cancelMutation.isPending}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Subscription
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleReactivateSubscription}
                    disabled={cancelMutation.isPending}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Reactivate Subscription
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : invoices.length > 0 ? (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">Invoice #{invoice.number}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invoice.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </p>
                    <Badge
                      variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                      className={invoice.status === 'paid' ? 'bg-green-500' : ''}
                    >
                      {invoice.status}
                    </Badge>
                    <div className="flex gap-1">
                      {invoice.pdf && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={invoice.pdf} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {invoice.hostedUrl && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={invoice.hostedUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No invoices found</p>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You'll still have access
              until the end of your current billing period on{' '}
              {subscription && format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy')}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}