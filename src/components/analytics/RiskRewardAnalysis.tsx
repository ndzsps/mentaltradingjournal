
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

  // Process trades to calculate R:R data
  const data = analytics.journalEntries
    .flatMap(entry => (entry.trades || []).map(trade => ({
      trade,
      entryDate: trade.entryDate || entry.created_at
    })))
    .map(({ trade, entryDate }) => {
      const entryPrice = Number(trade.entryPrice);
      const stopLoss = Number(trade.stopLoss);
      const takeProfit = Number(trade.takeProfit);
      const date = new Date(entryDate);
      
      // Calculate risk and reward based on trade direction
      let risk, reward;
      
      if (trade.direction === 'buy') {
        risk = Math.abs(entryPrice - stopLoss);
        reward = Math.abs(takeProfit - entryPrice);
      } else {
        risk = Math.abs(stopLoss - entryPrice);
        reward = Math.abs(entryPrice - takeProfit);
      }

      return {
        date,
        riskRewardRatio: risk > 0 ? reward / risk : 0,
        isSignificant: (reward / risk) > 3 || (reward / risk) < 0.5,
        pnl: Number(trade.pnl) || 0,
      };
    })
    .filter(d => d.riskRewardRatio > 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate percentage of trades with favorable ratio
  const favorableRatioPercentage = data.filter(d => d.riskRewardRatio >= 2).length / data.length;

  // Calculate average risk/reward ratio
  const avgRiskReward = data.length > 0
    ? Number((data.reduce((sum, d) => sum + d.riskRewardRatio, 0) / data.length).toFixed(2))
    : 0;

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Risk/Reward Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Risk to reward ratio over time
        </p>
      </div>

      <RiskRewardChart data={data} />

      <RiskRewardInsight 
        favorableRatioPercentage={favorableRatioPercentage}
        hasData={data.length > 0}
        avgRiskReward={avgRiskReward}
      />
    </Card>
  );
};
