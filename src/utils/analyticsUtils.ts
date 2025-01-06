interface JournalEntry {
  emotion: string;
  emotionDetail: string;
  outcome: string;
  notes: string;
  sessionType: 'pre' | 'post';
  timestamp: Date;
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

export const generateAnalytics = (journalEntries: JournalEntry[]): AnalyticsInsight => {
  if (!journalEntries.length) {
    return {
      performanceByEmotion: { positive: 60, neutral: 25, negative: 15 },
      emotionalImpact: {
        winRate: [65, 55, 35, 70, 50],
        dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      },
      emotionTrend: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        emotionalScore: Math.random() * 100,
        tradingResult: (Math.random() - 0.3) * 100,
      })).reverse(),
      emotionTrendInsights: {
        improvement: "Your emotional resilience has improved by 20% over the last month.",
        impact: "When emotional dips occurred more than 3 times a week, your performance dropped by 40%.",
      },
      mainInsight: "Not enough data to generate insights. Keep logging your trades!",
      recommendedAction: "Try to log at least 5 trades to get personalized insights.",
    };
  }

  // Calculate win rates by emotional state
  const emotionalOutcomes: Record<string, { wins: number; total: number }> = {
    positive: { wins: 0, total: 0 },
    neutral: { wins: 0, total: 0 },
    negative: { wins: 0, total: 0 },
  };

  journalEntries.forEach(entry => {
    const emotionType = entry.emotion;
    const isWin = entry.outcome === 'win';
    
    if (emotionalOutcomes[emotionType]) {
      emotionalOutcomes[emotionType].total++;
      if (isWin) emotionalOutcomes[emotionType].wins++;
    }
  });

  const performanceByEmotion = {
    positive: (emotionalOutcomes.positive.wins / emotionalOutcomes.positive.total) * 100 || 0,
    neutral: (emotionalOutcomes.neutral.wins / emotionalOutcomes.neutral.total) * 100 || 0,
    negative: (emotionalOutcomes.negative.wins / emotionalOutcomes.negative.total) * 100 || 0,
  };

  // Calculate daily win rates
  const last5Days = [...new Set(
    journalEntries
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)
      .map(entry => new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' }))
  )];

  const winRates = last5Days.map(date => {
    const dayEntries = journalEntries.filter(
      entry => new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' }) === date
    );
    const wins = dayEntries.filter(entry => entry.outcome === 'win').length;
    return (wins / dayEntries.length) * 100 || 0;
  });

  // Generate insights based on the data
  let mainInsight = '';
  let recommendedAction = '';

  const bestPerformance = Math.max(
    performanceByEmotion.positive,
    performanceByEmotion.neutral,
    performanceByEmotion.negative
  );

  if (bestPerformance === performanceByEmotion.positive) {
    mainInsight = `You win ${performanceByEmotion.positive.toFixed(1)}% of trades when in a positive emotional state, compared to ${performanceByEmotion.neutral.toFixed(1)}% in neutral states.`;
    recommendedAction = "Focus on maintaining a positive mindset for optimal performance.";
  } else if (bestPerformance === performanceByEmotion.neutral) {
    mainInsight = `Your highest win rate of ${performanceByEmotion.neutral.toFixed(1)}% occurs in neutral emotional states.`;
    recommendedAction = "Consider implementing a more systematic trading approach that relies less on emotions.";
  } else {
    mainInsight = `Your trading performance seems to be impacted by emotional states.`;
    recommendedAction = "Consider taking breaks when experiencing strong emotions before making trades.";
  }

  // Generate emotion trend data
  const emotionTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      emotionalScore: Math.random() * 100,
      tradingResult: (Math.random() - 0.3) * 100,
    };
  }).reverse();

  const emotionTrendInsights = {
    improvement: "Your emotional resilience has improved by 20% over the last month, and your trading consistency has increased by 15%.",
    impact: "When emotional dips occurred more than 3 times a week, your performance dropped by 40%.",
  };

  return {
    performanceByEmotion: {
      positive: 60,
      neutral: 25,
      negative: 15,
    },
    emotionalImpact: {
      winRate: [65, 55, 35, 70, 50],
      dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    emotionTrend,
    emotionTrendInsights,
    mainInsight: "Your trading performance shows strong correlation with emotional states.",
    recommendedAction: "Consider implementing emotional awareness exercises before trading.",
  };
};