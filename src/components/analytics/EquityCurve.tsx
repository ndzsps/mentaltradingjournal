import { Card } from "@/components/ui/card";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BalanceSelector } from "./equity-curve/BalanceSelector";
import { EquityCurveChart } from "./equity-curve/EquityCurveChart";
import { EquityMetrics } from "./equity-curve/EquityMetrics";

export const EquityCurve = () => {
  const [selectedBalance, setSelectedBalance] = useState(10000);
  
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });

  if (isLoading || !analytics) {
    return (
      <Card className="p-4 md:p-6 space-y-4 col-span-2">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/10 rounded w-3/4"></div>
          <div className="h-[400px] bg-accent/10 rounded"></div>
        </div>
      </Card>
    );
  }

  // Process journal entries to calculate equity curve data
  let runningBalance = selectedBalance;
  
  const equityData = analytics.journalEntries
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .reduce((acc: any[], entry) => {
      const dailyPnL = entry.trades?.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0) || 0;
      runningBalance += dailyPnL;
      
      acc.push({
        date: new Date(entry.created_at).toLocaleDateString(),
        balance: runningBalance,
        dailyPnL,
      });
      
      return acc;
    }, []);

  // Calculate performance metrics
  const currentBalance = equityData[equityData.length - 1]?.balance || selectedBalance;
  const totalReturn = ((currentBalance - selectedBalance) / selectedBalance) * 100;
  
  // Calculate maximum drawdown
  let maxDrawdown = 0;
  let peak = selectedBalance;
  
  equityData.forEach(point => {
    if (point.balance > peak) {
      peak = point.balance;
    }
    const drawdown = ((peak - point.balance) / peak) * 100;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });

  return (
    <Card className="p-4 md:p-6 space-y-4 col-span-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-bold">Equity Curve</h3>
          <BalanceSelector
            selectedBalance={selectedBalance}
            onBalanceChange={setSelectedBalance}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Track your account balance progression over time
        </p>
      </div>

      <EquityCurveChart
        data={equityData}
        initialBalance={selectedBalance}
      />

      <EquityMetrics
        initialBalance={selectedBalance}
        currentBalance={currentBalance}
        totalReturn={totalReturn}
        maxDrawdown={maxDrawdown}
      />
    </Card>
  );
};