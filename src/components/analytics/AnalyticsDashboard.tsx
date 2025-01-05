import { EmotionalTendencies } from "./EmotionalTendencies";
import { PerformanceBreakdown } from "./PerformanceBreakdown";

export const AnalyticsDashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">Trading Analytics</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Analyze your trading performance and emotional patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <EmotionalTendencies />
        <PerformanceBreakdown />
      </div>
    </div>
  );
};