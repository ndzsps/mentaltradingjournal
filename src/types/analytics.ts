export interface Trade {
  id?: string;
  instrument?: string;
  direction?: 'buy' | 'sell';
  entryDate?: string;
  exitDate?: string;
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  quantity?: number;
  fees?: number;
  setup?: string;
  pnl?: number | string;
  profit_loss?: number | string;
  forecastScreenshot?: string;
  resultScreenshot?: string;
  htfBias?: string;
}

export interface JournalEntry {
  id: string;
  emotion: string;
  emotion_detail: string;
  notes: string;
  session_type: 'pre' | 'post';
  trades: Trade[];
  market_conditions: string | null;
  followed_rules: string[] | null;
  mistakes: string[] | null;
  pre_trading_activities: string[] | null;
  created_at: string;
  outcome?: string;
  trading_rules_notes?: string;
  post_submission_notes?: string;
  user_id: string;
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