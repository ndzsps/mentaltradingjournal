
import { DollarSign, Percent, Smile, Flame } from "lucide-react";
import { StatCard } from "./StatCard";
import { TradeWinPercentage } from "../TradeWinPercentage";
import { TimeFilter } from "@/hooks/useJournalFilters";

interface StatsGridProps {
  netPnL: number;
  profitFactorValue: string;
  emotionScore: number;
  stats: { dailyStreak: number };
  timeFilter: TimeFilter;
}

export const StatsGrid = ({ 
  netPnL, 
  profitFactorValue, 
  emotionScore, 
  stats,
  timeFilter 
}: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCard
        title="Net P&L"
        value={Math.abs(netPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        subtitle={`${netPnL >= 0 ? '▲ Profit' : '▼ Loss'}`}
        icon={DollarSign}
        prefix="$"
        valueColor={netPnL >= 0 ? 'text-green-500' : 'text-red-500'}
      />

      <StatCard
        title="Profit Factor"
        value={profitFactorValue}
        subtitle="Profit/Loss Ratio"
        icon={Percent}
        iconColor="text-secondary"
      />

      <StatCard
        title="Emotion Meter"
        value={`${emotionScore.toFixed(0)}%`}
        subtitle="Positive Emotions"
        icon={Smile}
        iconColor="text-accent-dark"
      />

      <TradeWinPercentage timeFilter={timeFilter} />

      <StatCard
        title="Daily Streak"
        value={stats.dailyStreak}
        subtitle="Days Active"
        icon={Flame}
        iconColor="text-orange-500"
      />
    </div>
  );
};
