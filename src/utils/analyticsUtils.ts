
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsInsight, JournalEntry } from "@/types/analytics";
import { calculateDataRequirements } from "./dataRequirements";
import { processJournalTrades, calculateAssetPairStats } from "./analytics/tradeProcessing";
import { calculateEmotionRecovery, calculateEmotionTrend } from "./analytics/emotionAnalysis";
import { calculateMistakeFrequencies } from "./analytics/mistakeAnalysis";
import { analyzeTradeDurations } from "./analytics/tradeDurationAnalysis";

export const generateAnalytics = async (): Promise<AnalyticsInsight> => {
  console.log('Fetching journal entries...');
  
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false });  // Changed to descending to get newest first

  if (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }

  if (!entries || entries.length === 0) {
    console.log('No journal entries found');
  } else {
    console.log(`Found ${entries.length} journal entries`);
    console.log('Most recent entries:', entries.slice(0, 3));
  }

  // Cast the entries to the correct type and ensure session_type is 'pre' or 'post' or 'trade'
  const journalEntries = (entries || []).map(entry => ({
    ...entry,
    session_type: ['pre', 'post', 'trade'].includes(entry.session_type) 
      ? entry.session_type as 'pre' | 'post' | 'trade' 
      : 'pre'
  })) as JournalEntry[];

  const dataRequirements = calculateDataRequirements(journalEntries);

  // Process trades using utility functions
  const allTrades = processJournalTrades(journalEntries);
  console.log('Processed trades:', allTrades.length);

  const assetPairStats = calculateAssetPairStats(allTrades);
  const mistakeFrequencies = calculateMistakeFrequencies(journalEntries);
  const emotionRecovery = calculateEmotionRecovery(journalEntries);
  const tradeDurations = analyzeTradeDurations(allTrades);
  const emotionTrend = calculateEmotionTrend(journalEntries);

  // Process market volatility data
  const volatilityData = journalEntries.map(entry => ({
    volatility: entry.market_conditions?.includes('high') ? 75 :
      entry.market_conditions?.includes('medium') ? 50 : 25,
    performance: entry.trades?.reduce((sum, trade) => {
      const pnl = typeof trade.pnl === 'string' ? parseFloat(trade.pnl) : 
                 typeof trade.pnl === 'number' ? trade.pnl : 
                 typeof trade.profit_loss === 'string' ? parseFloat(trade.profit_loss) :
                 typeof trade.profit_loss === 'number' ? trade.profit_loss : 0;
      return sum + pnl;
    }, 0) || 0,
    emotional: entry.emotion
  }));

  // Calculate risk/reward data
  const riskRewardData = allTrades
    .filter(trade => trade.entryPrice && trade.stopLoss && trade.takeProfit)
    .map(trade => ({
      risk: Math.abs(Number(trade.entryPrice) - Number(trade.stopLoss)),
      reward: Math.abs(Number(trade.takeProfit) - Number(trade.entryPrice)),
      size: Number(trade.quantity) || 1,
    }));

  const emotionTrendWithScores = emotionTrend.map(trend => ({
    ...trend,
    emotionalScore: trend.emotion === 'positive' ? 1 : trend.emotion === 'negative' ? -1 : 0,
    tradingResult: trend.pnl
  }));

  // Calculate performance by emotion
  const performanceByEmotion = journalEntries.reduce((acc, entry) => {
    if (entry.trades && entry.trades.length > 0) {
      const totalPnL = entry.trades.reduce((sum, trade) => {
        const pnl = typeof trade.pnl === 'string' ? parseFloat(trade.pnl) : 
                   typeof trade.pnl === 'number' ? trade.pnl : 
                   typeof trade.profit_loss === 'string' ? parseFloat(trade.profit_loss) :
                   typeof trade.profit_loss === 'number' ? trade.profit_loss : 0;
        return sum + pnl;
      }, 0);

      if (entry.emotion === 'positive') acc.positive += totalPnL;
      else if (entry.emotion === 'neutral') acc.neutral += totalPnL;
      else if (entry.emotion === 'negative') acc.negative += totalPnL;
    }
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  console.log('Analytics generation complete');
  console.log('Journal entries by type:', 
    journalEntries.reduce((acc, entry) => {
      acc[entry.session_type] = (acc[entry.session_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  return {
    journalEntries,
    performanceByEmotion,
    emotionalImpact: {
      winRate: [],
      dates: [],
    },
    emotionTrend: emotionTrendWithScores,
    emotionTrendInsights: {
      improvement: `Your emotional resilience has ${
        emotionTrendWithScores[emotionTrendWithScores.length - 1]?.emotionalScore > emotionTrendWithScores[0]?.emotionalScore 
          ? 'improved' 
          : 'decreased'
      } over the last month.`,
      impact: `Trading results show ${
        Math.abs(emotionTrendWithScores.reduce((sum, day) => sum + (day.tradingResult || 0), 0))
      }$ impact on your P&L.`,
    },
    mainInsight: "Based on your journal entries, there's a strong correlation between emotional state and trading performance.",
    recommendedAction: "Focus on maintaining emotional balance during trading sessions.",
    dataRequirements,
    mistakeFrequencies,
    assetPairStats,
    emotionRecovery,
    tradeDurations,
    volatilityData,
    riskRewardData,
  };
};
