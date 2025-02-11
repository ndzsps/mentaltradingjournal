
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

export default function Analytics() {
  return (
    <AppLayout>
      <SubscriptionGate>
        <AnalyticsDashboard />
      </SubscriptionGate>
    </AppLayout>
  );
}
