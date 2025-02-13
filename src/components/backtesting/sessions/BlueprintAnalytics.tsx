
import { Card } from "@/components/ui/card";
import { Session } from "./types";
import { AssetPairChart } from "@/components/analytics/asset-pair/AssetPairChart";
import { RiskRewardChart } from "@/components/analytics/risk-reward/RiskRewardChart";
import { EquityCurveChart } from "@/components/analytics/equity-curve/EquityCurveChart";
import { EquityMetrics } from "@/components/analytics/equity-curve/EquityMetrics";

interface BlueprintAnalyticsProps {
  sessions: Session[];
}

export const BlueprintAnalytics = ({ sessions }: BlueprintAnalyticsProps) => {
  // Process sessions for asset pair performance
  const assetPairData = sessions.reduce((acc, session) => {
    const instrument = session.instrument || 'Unknown';
    if (!acc[instrument]) {
      acc[instrument] = { profit: 0, loss: 0, net: 0 };
    }
    const pnl = session.pnl || 0;
    if (pnl > 0) {
      acc[instrument].profit += pnl;
    } else {
      acc[instrument].loss += Math.abs(pnl);
    }
    acc[instrument].net = acc[instrument].profit - acc[instrument].loss;
    return acc;
  }, {} as Record<string, { profit: number; loss: number; net: number; }>);

  const chartData = Object.entries(assetPairData).map(([pair, stats]) => ({
    pair,
    profit: stats.profit,
    loss: -Math.abs(stats.loss),
    net: stats.net,
  }));

  // Process sessions for risk/reward analysis
  const riskRewardData = sessions
    .filter(session => session.entryPrice && session.stopLoss && session.takeProfit)
    .map(session => {
      const entryPrice = Number(session.entryPrice);
      const stopLoss = Number(session.stopLoss);
      const takeProfit = Number(session.takeProfit);
      const date = new Date(session.exitDate);
      
      let risk = 0;
      let reward = 0;
      
      if (session.direction === 'buy') {
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
        pnl: session.pnl || 0,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Process sessions for equity curve
  const equityCurveData = sessions
    .sort((a, b) => new Date(a.exitDate).getTime() - new Date(b.exitDate).getTime())
    .reduce((acc, session, index) => {
      const date = new Date(session.exitDate).toLocaleDateString();
      const previousBalance = index > 0 ? acc[index - 1].balance : 0;
      const dailyPnL = session.pnl || 0;
      
      acc.push({
        date,
        balance: previousBalance + dailyPnL,
        dailyPnL,
      });
      
      return acc;
    }, [] as Array<{ date: string; balance: number; dailyPnL: number; }>);

  const initialBalance = 0;
  const currentBalance = equityCurveData.length > 0 
    ? equityCurveData[equityCurveData.length - 1].balance 
    : 0;
  const totalReturn = initialBalance !== 0 
    ? ((currentBalance - initialBalance) / initialBalance) * 100 
    : 0;

  // Calculate max drawdown percentage
  const maxDrawdownPercentage = equityCurveData.reduce((maxDD, point, index) => {
    const peak = Math.max(...equityCurveData.slice(0, index + 1).map(p => p.balance));
    const drawdown = ((peak - point.balance) / peak) * 100;
    return Math.max(maxDD, drawdown);
  }, 0);

  return (
    <div className="space-y-8 mt-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Blueprint Analytics</h2>
        <EquityMetrics
          initialBalance={initialBalance}
          currentBalance={currentBalance}
          totalReturn={totalReturn}
          maxDrawdown={maxDrawdownPercentage}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Equity Curve</h3>
        <div className="h-[400px]">
          <EquityCurveChart
            data={equityCurveData}
            initialBalance={initialBalance}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Asset Pair Performance</h3>
        <AssetPairChart data={chartData} />
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Risk/Reward Analysis</h3>
        <RiskRewardChart data={riskRewardData} />
      </Card>
    </div>
  );
};
