export interface JournalEntry {
  id: string;
  created_at: string;
  session_type: "pre" | "post";
  emotion: string;
  emotion_detail: string;
  notes: string;
  outcome?: string;
  market_conditions?: string;
  trades?: Trade[];
  followed_rules?: string[];
  post_submission_notes?: string;
  pre_trading_activities?: string[];
}

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
  emotionTrend: any[];
  emotionTrendInsights: {
    improvement: string;
    impact: string;
  };
  mainInsight: string;
  recommendedAction: string;
  dataRequirements: any;
  mistakeFrequencies: any;
  assetPairStats: any;
  emotionRecovery: any;
  tradeDurations: any;
  volatilityData: any;
  riskRewardData: any;
}