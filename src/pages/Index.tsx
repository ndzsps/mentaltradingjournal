
import { AppLayout } from "@/components/layout/AppLayout";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

const Index = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-8">
        <AnalyticsSection />
        <FeaturesSection />
      </div>
    </AppLayout>
  );
};

export default Index;
