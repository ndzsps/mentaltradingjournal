import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 px-4">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your trading journey and improve your mindset
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <EmotionLogger />
          
          <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent mb-6">
              Your Progress
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Daily Streak</span>
                  <span className="text-primary-light">3 days</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary-light rounded-full" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Level Progress</span>
                  <span className="text-accent">Level 2</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-accent/70 to-accent rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;