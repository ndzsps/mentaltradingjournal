
import { AppLayout } from "@/components/layout/AppLayout";
import { WeeklyPerformance } from "@/components/journal/WeeklyPerformance";
import { SessionProgress } from "@/components/journal/SessionProgress";
import { ProgressStats } from "@/components/journal/ProgressStats";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <AppLayout>
      <SubscriptionGate>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <WeeklyPerformance />
            </Card>
            <Card className="p-6">
              <SessionProgress />
            </Card>
            <Card className="p-6">
              <ProgressStats />
            </Card>
          </div>
        </div>
      </SubscriptionGate>
    </AppLayout>
  );
};

export default Dashboard;
