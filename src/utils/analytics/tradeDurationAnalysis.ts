import { Trade } from "@/types/analytics";

export const analyzeTradeDurations = (trades: Trade[]) => {
  return trades.reduce((acc, trade) => {
    if (!trade.entryDate || !trade.exitDate) return acc;
    
    const duration = Math.floor(
      (new Date(trade.exitDate).getTime() - new Date(trade.entryDate).getTime()) / (1000 * 60)
    );
    
    const range = duration <= 10 ? '< 10 min' :
                 duration <= 30 ? '10-30 min' :
                 duration <= 60 ? '30-60 min' : '> 1 hour';
                 
    if (!acc[range]) acc[range] = { count: 0, wins: 0 };
    acc[range].count++;
    if (Number(trade.pnl) > 0) acc[range].wins++;
    return acc;
  }, {} as Record<string, { count: number; wins: number }>);
};