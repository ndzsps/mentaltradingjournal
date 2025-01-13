import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Session } from "./types";

interface BacktestingStatsProps {
  sessions: Session[];
}

export const BacktestingStats = ({ sessions }: BacktestingStatsProps) => {
  // Calculate net P&L
  const netPnL = sessions.reduce((total, session) => total + (session.pnl || 0), 0);

  // Calculate win rate
  const winningTrades = sessions.filter(session => (session.pnl || 0) > 0).length;
  const winRate = sessions.length > 0 ? (winningTrades / sessions.length) * 100 : 0;

  // Calculate profit factor
  const profitFactor = sessions.reduce(
    (acc, session) => {
      const pnl = session.pnl || 0;
      if (pnl > 0) acc.profits += pnl;
      if (pnl < 0) acc.losses += Math.abs(pnl);
      return acc;
    },
    { profits: 0, losses: 0 }
  );

  const profitFactorValue = profitFactor.losses === 0 
    ? profitFactor.profits > 0 ? "∞" : "0" 
    : (profitFactor.profits / profitFactor.losses).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Net P&L</p>
            <p className={`text-2xl font-bold ${netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${netPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Total profit/loss across all sessions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </Card>

      <Card className="p-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Trade Win %</p>
            <p className="text-2xl font-bold">
              {winRate.toFixed(2)}%
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Percentage of profitable trades</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </Card>

      <Card className="p-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Profit Factor</p>
            <p className="text-2xl font-bold">
              {profitFactorValue}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Ratio of gross profit to gross loss</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </Card>

      <Card className="p-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Daily Win %</p>
            <p className="text-2xl font-bold">
              {winRate.toFixed(2)}%
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Percentage of profitable days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </Card>
    </div>
  );
};