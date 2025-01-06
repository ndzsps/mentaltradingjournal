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

export interface AnalyticsInsight {
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
}