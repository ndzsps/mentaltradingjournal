
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { SubscriptionGuard } from "@/components/subscription/SubscriptionGuard";

export default function Analytics() {
  return (
    <AppLayout>
      <SubscriptionGuard>
        <AnalyticsDashboard />
      </SubscriptionGuard>
    </AppLayout>
  );
}
