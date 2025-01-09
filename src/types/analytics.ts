export interface JournalEntry {
  emotion: string;
  emotion_detail: string;
  outcome: string;
  notes: string;
  session_type: 'pre' | 'post';
  trades: any[];
  market_conditions: string | null;
  followed_rules: string[] | null;
  mistakes: string[] | null;
  pre_trading_activities: string[] | null;
  created_at: string;
}

interface MistakeFrequency {
  count: number;
  loss: number;
}

interface AssetPairStat {
  profit: number;
  loss: number;
  total: number;
}

export interface AnalyticsInsight {
  journalEntries: JournalEntry[];
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
  dataRequirements: {
    [key: string]: {
      hasEnoughData: boolean;
      requiredFields: string[];
      description: string;
    };
  };
  // Add new properties for real data analytics
  mistakeFrequencies: Record<string, MistakeFrequency>;
  assetPairStats: Record<string, AssetPairStat>;
  emotionRecovery: Record<string, number>;
  tradeDurations: Record<string, { count: number; wins: number }>;
  volatilityData: Array<{
    volatility: number;
    performance: number;
    emotional: string;
  }>;
  riskRewardData: Array<{
    risk: number;
    reward: number;
    size: number;
  }>;
}