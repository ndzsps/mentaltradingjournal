import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { RiskRewardChart } from "./risk-reward/RiskRewardChart";
import { RiskRewardInsight } from "./risk-reward/RiskRewardInsight";

export const RiskRewardAnalysis = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });

  if (isLoading || !analytics) {
    return (
      <Card className="p-4 md:p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/10 rounded w-3/4"></div>
          <div className="h-[250px] md:h-[300px] bg-accent/10 rounded"></div>
        </div>
      </Card>
    );
  }

  const { riskRewardData } = analytics;

  // Filter out trades with invalid risk/reward values
  const validTrades = riskRewardData.filter(trade => 
    trade.risk > 0 && 
    trade.reward > 0 && 
    !isNaN(trade.risk) && 
    !isNaN(trade.reward)
  );

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Risk/Reward Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Analyze your risk management and potential returns
        </p>
      </div>

      <RiskRewardChart data={validTrades} />
      
      <RiskRewardInsight data={validTrades} />
    </Card>
  );
};