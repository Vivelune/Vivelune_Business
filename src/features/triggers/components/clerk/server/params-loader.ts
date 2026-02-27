// src/features/triggers/components/clerk/server/params-loader.ts
import { createLoader, parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs/server";

export const clerkParamsLoader = createLoader({
  eventType: parseAsStringEnum(['user.created', 'user.updated', 'user.deleted', 'session.created', 'session.ended', 'email.created']).withDefault('user.created'),
  dateRange: parseAsStringEnum(['today', 'week', 'month', 'all']).withDefault('month'),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
});