import { JournalEntry, Trade } from "@/types/analytics";

export const normalizeTradePnL = (trade: Trade) => {
  return {
    ...trade,
    pnl: typeof trade.pnl === 'string' ? parseFloat(trade.pnl) : 
         typeof trade.pnl === 'number' ? trade.pnl : 
         typeof trade.profit_loss === 'string' ? parseFloat(trade.profit_loss) :
         typeof trade.profit_loss === 'number' ? trade.profit_loss : 0
  };
};

export const processJournalTrades = (journalEntries: JournalEntry[]) => {
  return journalEntries.flatMap(entry => {
    const trades = entry.trades || [];
    return trades.map(normalizeTradePnL);
  });
};

export const calculateAssetPairStats = (trades: Trade[]) => {
  return trades.reduce((acc, trade) => {
    const instrument = trade.instrument || 'Unknown';
    if (!acc[instrument]) {
      acc[instrument] = { profit: 0, loss: 0, total: 0 };
    }
    const pnl = Number(trade.pnl) || 0;
    acc[instrument].total++;
    if (pnl > 0) acc[instrument].profit += pnl;
    else acc[instrument].loss += Math.abs(pnl);
    return acc;
  }, {} as Record<string, { profit: number; loss: number; total: number }>);
};