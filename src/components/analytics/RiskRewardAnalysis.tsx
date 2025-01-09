import { Card } from "@/components/ui/card";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";
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

  // Process trades to calculate risk/reward data
  const data = analytics.journalEntries
    .flatMap(entry => entry.trades || [])
    .map(trade => {
      const entryPrice = Number(trade.entryPrice);
      const stopLoss = Number(trade.stopLoss);
      const takeProfit = Number(trade.takeProfit);
      const size = Number(trade.quantity);

      const risk = Math.abs(entryPrice - stopLoss);
      const reward = Math.abs(takeProfit - entryPrice);

      return {
        risk,
        reward,
        size,
      };
    })
    .filter(d => d.risk > 0 && d.reward > 0); // Filter out invalid data

  // Calculate average risk:reward ratio
  const avgRiskReward = Math.round(
    data.reduce((sum, item) => sum + (item.reward / item.risk), 0) / (data.length || 1)
  );

  // Calculate percentage of trades with favorable ratio
  const favorableRatioPercentage = data.filter(d => 
    Math.round(d.reward / d.risk) >= 2
  ).length / data.length;

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Risk/Reward Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Visualization of risk vs reward ratios in your trades
        </p>
      </div>

      <RiskRewardChart data={data} />

      <RiskRewardInsight 
        avgRiskReward={avgRiskReward}
        favorableRatioPercentage={favorableRatioPercentage}
        hasData={data.length > 0}
      />
    </Card>
  );
};