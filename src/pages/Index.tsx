
import { AppLayout } from "@/components/layout/AppLayout";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";

const Index = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <AnalyticsSection />
      </div>
    </AppLayout>
  );
};

export default Index;
