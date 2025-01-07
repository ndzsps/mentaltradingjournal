interface PerformanceInsightProps {
  mainInsight: string;
  recommendedAction: string;
}

export const PerformanceInsight = ({ mainInsight, recommendedAction }: PerformanceInsightProps) => {
  return (
    <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
      <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
      <p className="text-xs md:text-sm text-muted-foreground">
        {mainInsight} {recommendedAction}
      </p>
    </div>
  );
};