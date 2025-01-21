import { Trade } from "@/types/analytics";

export const analyzeTradeDurations = (trades: Trade[]) => {
  return trades
    .filter(trade => trade.entryDate && trade.exitDate)
    .map(trade => {
      const entryDate = new Date(trade.entryDate!);
      const exitDate = new Date(trade.exitDate!);
      const duration = exitDate.getTime() - entryDate.getTime();
      const hours = duration / (1000 * 60 * 60);
      
      return {
        duration: hours,
        pnl: Number(trade.pnl) || 0,
        category: hours <= 1 ? '< 1h' :
                 hours <= 4 ? '1-4h' :
                 hours <= 24 ? '4-24h' : '> 24h'
      };
    });
};