import { supabase } from "@/integrations/supabase/client";
import { AnalyticsInsight, JournalEntry } from "@/types/analytics";
import { calculateDataRequirements } from "./dataRequirements";

export const generateAnalytics = async (): Promise<AnalyticsInsight> => {
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('session_type', 'post')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }

  const journalEntries = entries as JournalEntry[] || [];
  const dataRequirements = calculateDataRequirements(journalEntries);

  // Process all trades from journal entries
  const allTrades = journalEntries.flatMap(entry => entry.trades || []);
  
  // Calculate asset pair performance
  const assetPairStats = allTrades.reduce((acc, trade) => {
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

  // Calculate mistake frequencies
  const mistakeFrequencies = journalEntries.reduce((acc, entry) => {
    (entry.mistakes || []).forEach(mistake => {
      if (!acc[mistake]) acc[mistake] = { count: 0, loss: 0 };
      acc[mistake].count++;
      // Sum up losses for trades in entries with this mistake
      const totalLoss = (entry.trades || [])
        .reduce((sum, trade) => sum + (Number(trade.pnl) < 0 ? Math.abs(Number(trade.pnl)) : 0), 0);
      acc[mistake].loss += totalLoss;
    });
    return acc;
  }, {} as Record<string, { count: number; loss: number }>);

  // Calculate emotion recovery patterns
  const emotionRecovery = journalEntries.reduce((acc, entry, i, arr) => {
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

  // Calculate trade durations
  const tradeDurations = allTrades.reduce((acc, trade) => {
    const duration = trade.exitDate && trade.entryDate ?
      Math.floor((new Date(trade.exitDate).getTime() - new Date(trade.entryDate).getTime()) / (1000 * 60)) : 0;
    const range = duration <= 10 ? '< 10 min' :
      duration <= 30 ? '10-30 min' :
      duration <= 60 ? '30-60 min' : '> 1 hour';
    if (!acc[range]) acc[range] = { count: 0, wins: 0 };
    acc[range].count++;
    if (Number(trade.pnl) > 0) acc[range].wins++;
    return acc;
  }, {} as Record<string, { count: number; wins: number }>);

  // Calculate emotion trend
  const emotionTrend = journalEntries.slice(0, 30).map(entry => {
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

  // Process market volatility data
  const volatilityData = journalEntries.map(entry => ({
    volatility: entry.market_conditions?.includes('high') ? 75 :
      entry.market_conditions?.includes('medium') ? 50 : 25,
    performance: entry.trades?.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0) || 0,
    emotional: entry.emotion
  }));

  // Calculate risk/reward data
  const riskRewardData = allTrades.map(trade => ({
    risk: trade.stopLoss ? Math.abs(Number(trade.entryPrice) - Number(trade.stopLoss)) : 0,
    reward: trade.takeProfit ? Math.abs(Number(trade.takeProfit) - Number(trade.entryPrice)) : 0,
    size: Number(trade.quantity) || 1,
  })).filter(data => data.risk > 0 && data.reward > 0);

  return {
    journalEntries,
    performanceByEmotion: {
      positive: 0,
      neutral: 0,
      negative: 0,
    },
    emotionalImpact: {
      winRate: [],
      dates: [],
    },
    emotionTrend,
    emotionTrendInsights: {
      improvement: `Your emotional resilience has ${
        emotionTrend[emotionTrend.length - 1]?.emotionalScore > emotionTrend[0]?.emotionalScore 
          ? 'improved' 
          : 'decreased'
      } over the last month.`,
      impact: `Trading results show ${
        Math.abs(emotionTrend.reduce((sum, day) => sum + day.tradingResult, 0))
      }$ impact on your P&L.`,
    },
    mainInsight: "Based on your journal entries, there's a strong correlation between emotional state and trading performance.",
    recommendedAction: "Focus on maintaining emotional balance during trading sessions.",
    dataRequirements,
    // Additional real data
    mistakeFrequencies,
    assetPairStats,
    emotionRecovery,
    tradeDurations,
    volatilityData,
    riskRewardData,
  };
};