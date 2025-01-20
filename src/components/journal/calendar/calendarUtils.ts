import { Trade } from "@/types/trade";

export const calculateDayStats = (entries: Array<{ trades?: Trade[] }>) => {
  if (entries.length === 0) return null;

  // Create a Map to store unique trades with their latest values
  const tradeMap = new Map<string, Trade>();
  
  // Process all trades, keeping only the latest version of each trade
  entries.forEach(entry => {
    if (entry.trades && entry.trades.length > 0) {
      entry.trades.forEach(trade => {
        if (trade && trade.id) {
          // Always keep the latest version of the trade
          tradeMap.set(trade.id, trade);
        }
      });
    }
  });

  // Calculate totals using only unique trades
  let totalPL = 0;
  let totalTrades = 0;

  tradeMap.forEach(trade => {
    totalTrades++;
    const pnlValue = trade.pnl || trade.profit_loss || 0;
    const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
    totalPL += isNaN(numericPnL) ? 0 : numericPnL;
  });

  return {
    totalPL,
    numTrades: totalTrades,
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getEmotionStyle = (stats: { totalPL: number } | null) => {
  if (!stats) return null;

  return {
    bg: stats.totalPL >= 0 
      ? "bg-emerald-50 dark:bg-emerald-950/30" 
      : "bg-red-50 dark:bg-red-950/30",
    border: stats.totalPL >= 0 
      ? "border-emerald-100 dark:border-emerald-800" 
      : "border-red-100 dark:border-red-800",
    shadow: stats.totalPL >= 0 
      ? "shadow-emerald-100/50 dark:shadow-emerald-900/50" 
      : "shadow-red-100/50 dark:shadow-red-900/50",
  };
};