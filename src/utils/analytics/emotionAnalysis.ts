import { JournalEntry } from "@/types/analytics";

export const calculateEmotionRecovery = (entries: JournalEntry[]) => {
  return entries.reduce((acc, entry, i, arr) => {
    if (entry.outcome === 'loss') {
      let daysToRecover = 0;
      for (let j = i - 1; j >= 0; j--) {
        if (arr[j].outcome === 'win') break;
        daysToRecover++;
      }
      const recoveryRange = daysToRecover <= 1 ? '< 1 day' :
        daysToRecover <= 2 ? '1-2 days' :
        daysToRecover <= 3 ? '2-3 days' : '> 3 days';
      acc[recoveryRange] = (acc[recoveryRange] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
};

export const calculateEmotionTrend = (entries: JournalEntry[]) => {
  return entries.slice(0, 30).map(entry => {
    const emotionalScore = entry.emotion?.toLowerCase().includes('positive') ? 75 :
      entry.emotion?.toLowerCase().includes('neutral') ? 50 : 25;
    
    const tradingResult = entry.trades?.reduce((acc, trade) => 
      acc + (Number(trade.pnl) || 0), 0) || 0;

    return {
      date: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      emotionalScore,
      tradingResult,
    };
  }).reverse();
};