import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">Welcome back!</h1>
          <p className="text-lg text-gray-600">
            Track your trading journey and improve your mindset
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <EmotionLogger />
          
          <Card className="p-6 bg-white/50 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-primary mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Streak</span>
                  <span className="font-semibold">3 days</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level Progress</span>
                  <span className="font-semibold">Level 2</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-secondary to-accent" />
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