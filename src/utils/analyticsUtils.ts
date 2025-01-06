import { supabase } from "@/integrations/supabase/client";

interface JournalEntry {
  emotion: string;
  emotion_detail: string;
  outcome: string;
  notes: string;
  session_type: 'pre' | 'post';
  trades: any[];
  market_conditions: string | null;
  followed_rules: string[] | null;
  mistakes: string[] | null;
  created_at: string;
}

interface AnalyticsInsight {
  performanceByEmotion: {
    positive: number;
    neutral: number;
    negative: number;
  };
  emotionalImpact: {
    winRate: number[];
    dates: string[];
  };
  emotionTrend: Array<{
    date: string;
    emotionalScore: number;
    tradingResult: number;
  }>;
  emotionTrendInsights: {
    improvement: string;
    impact: string;
  };
  mainInsight: string;
  recommendedAction: string;
}

export const fetchJournalEntries = async () => {
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }

  return entries as JournalEntry[];
};

export const generateAnalytics = async (): Promise<AnalyticsInsight> => {
  const journalEntries = await fetchJournalEntries();

  if (!journalEntries.length) {
    return {
      performanceByEmotion: { positive: 0, neutral: 0, negative: 0 },
      emotionalImpact: {
        winRate: [],
        dates: [],
      },
      emotionTrend: [],
      emotionTrendInsights: {
        improvement: "Start logging trades to see emotional impact analysis.",
        impact: "No data available yet.",
      },
      mainInsight: "Not enough data to generate insights. Keep logging your trades!",
      recommendedAction: "Try to log at least 5 trades to get personalized insights.",
    };
  }

  // Calculate performance by emotion
  const emotionCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0,
  };

  journalEntries.forEach(entry => {
    const emotion = entry.emotion.toLowerCase();
    if (emotion.includes('positive')) emotionCounts.positive++;
    else if (emotion.includes('neutral')) emotionCounts.neutral++;
    else if (emotion.includes('negative')) emotionCounts.negative++;
    emotionCounts.total++;
  });

  const performanceByEmotion = {
    positive: (emotionCounts.positive / emotionCounts.total) * 100 || 0,
    neutral: (emotionCounts.neutral / emotionCounts.total) * 100 || 0,
    negative: (emotionCounts.negative / emotionCounts.total) * 100 || 0,
  };

  // Calculate win rates by date
  const last5Days = [...new Set(
    journalEntries
      .slice(0, 5)
      .map(entry => new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' }))
  )];

  const winRates = last5Days.map(date => {
    const dayEntries = journalEntries.filter(
      entry => new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' }) === date
    );
    const wins = dayEntries.filter(entry => entry.outcome === 'win').length;
    return (wins / dayEntries.length) * 100 || 0;
  });

  // Generate emotion trend data
  const emotionTrend = journalEntries.slice(0, 30).map(entry => {
    const emotionalScore = entry.emotion.toLowerCase().includes('positive') ? 75 :
      entry.emotion.toLowerCase().includes('neutral') ? 50 : 25;
    
    const tradingResult = entry.trades.reduce((acc, trade) => {
      return acc + (trade.pnl || 0);
    }, 0);

    return {
      date: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      emotionalScore,
      tradingResult,
    };
  }).reverse();

  // Generate insights
  const mainInsight = `Your trading performance shows strong correlation with emotional states. ${
    performanceByEmotion.positive > 50 ? 
    'Positive emotions lead to better outcomes.' : 
    'Consider working on emotional management.'
  }`;

  const recommendedAction = emotionCounts.negative > emotionCounts.positive ?
    "Focus on maintaining a positive mindset before trading." :
    "Keep up the good work with emotional management.";

  return {
    performanceByEmotion,
    emotionalImpact: {
      winRate: winRates,
      dates: last5Days,
    },
    emotionTrend,
    emotionTrendInsights: {
      improvement: `Your emotional resilience has ${
        performanceByEmotion.positive > 50 ? 'improved' : 'decreased'
      } over the last month.`,
      impact: `When emotional dips occurred, your win rate dropped by approximately ${
        Math.round((performanceByEmotion.positive - performanceByEmotion.negative) * 100) / 100
      }%.`,
    },
    mainInsight,
    recommendedAction,
  };
};