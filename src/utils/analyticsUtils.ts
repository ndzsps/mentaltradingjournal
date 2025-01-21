import { supabase } from "@/integrations/supabase/client";
import { AnalyticsInsight, JournalEntry } from "@/types/analytics";
import { calculateDataRequirements } from "./dataRequirements";
import { processJournalTrades, calculateAssetPairStats } from "./analytics/tradeProcessing";
import { calculateEmotionRecovery, calculateEmotionTrend } from "./analytics/emotionAnalysis";
import { calculateMistakeFrequencies } from "./analytics/mistakeAnalysis";
import { analyzeTradeDurations } from "./analytics/tradeDurationAnalysis";

export const generateAnalytics = async (): Promise<AnalyticsInsight> => {
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }

  // Cast the entries to the correct type and ensure session_type is 'pre' or 'post'
  const journalEntries = (entries || []).map(entry => ({
    ...entry,
    session_type: entry.session_type === 'pre' ? 'pre' : 'post'
  })) as JournalEntry[];

  const dataRequirements = calculateDataRequirements(journalEntries);

  // Process trades using utility functions
  const allTrades = processJournalTrades(journalEntries);
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
    mistakeFrequencies,
    assetPairStats,
    emotionRecovery,
    tradeDurations,
    volatilityData,
    riskRewardData,
  };
};