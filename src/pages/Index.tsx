import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8 px-4">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Trading Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to your trading mindset companion
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <EmotionLogger />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;