import { EmotionalTendencies } from "./EmotionalTendencies";
import { PerformanceBreakdown } from "./PerformanceBreakdown";

export const AnalyticsDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Trading Analytics</h2>
        <p className="text-muted-foreground">
          Analyze your trading performance and emotional patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmotionalTendencies />
        <PerformanceBreakdown />
      </div>
    </div>
  );
};