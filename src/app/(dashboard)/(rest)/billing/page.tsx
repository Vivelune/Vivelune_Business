// src/app/(dashboard)/(rest)/billing/page.tsx
import { BillingPage } from '@/features/billing/hooks/components/billing-page';
import { requireAuth } from '@/lib/auth-utils';

export default async function Page() {
  await requireAuth();
  return <BillingPage />;
}