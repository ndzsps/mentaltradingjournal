export const calculateDataRequirements = (journalEntries: any[]) => ({
  assetPairPerformance: {
    hasEnoughData: journalEntries.some(entry => entry.trades?.length > 0),
    requiredFields: ['trades.instrument', 'trades.pnl'],
    description: 'Add trades with instrument names and profit/loss values',
  },
  emotionRecovery: {
    hasEnoughData: journalEntries.filter(entry => entry.outcome === 'loss').length >= 5,
    requiredFields: ['emotion', 'outcome', 'created_at'],
    description: 'Log emotions after losing trades',
  },
  marketVolatility: {
    hasEnoughData: journalEntries.filter(entry => entry.market_conditions).length >= 10,
    requiredFields: ['market_conditions', 'emotion', 'trades'],
    description: 'Add market conditions to your journal entries',
  },
  mistakeAnalysis: {
    hasEnoughData: journalEntries.filter(entry => entry.mistakes?.length > 0).length >= 5,
    requiredFields: ['mistakes', 'trades.pnl'],
    description: 'Log trading mistakes in your journal entries',
  },
  personalityPatterns: {
    hasEnoughData: journalEntries.length >= 14,
    requiredFields: ['emotion', 'followed_rules', 'outcome'],
    description: 'Consistently log emotions and followed rules',
  },
  preTradingEvents: {
    hasEnoughData: journalEntries.filter(entry => entry.pre_trading_activities?.length > 0).length >= 5,
    requiredFields: ['pre_trading_activities', 'outcome'],
    description: 'Log pre-trading activities in your journal',
  },
  profitLossDistribution: {
    hasEnoughData: journalEntries.some(entry => entry.trades?.length > 0),
    requiredFields: ['trades.pnl'],
    description: 'Add profit/loss values to your trades',
  },
  riskRewardAnalysis: {
    hasEnoughData: journalEntries.some(entry => 
      entry.trades?.some(trade => trade.stopLoss && trade.takeProfit)
    ),
    requiredFields: ['trades.stopLoss', 'trades.takeProfit', 'trades.entryPrice'],
    description: 'Add stop loss and take profit levels to your trades',
  },
  ruleAdherence: {
    hasEnoughData: journalEntries.filter(entry => entry.followed_rules?.length > 0).length >= 5,
    requiredFields: ['followed_rules', 'outcome'],
    description: 'Log which trading rules you followed',
  },
  tradeDuration: {
    hasEnoughData: journalEntries.some(entry => 
      entry.trades?.some(trade => trade.entryDate && trade.exitDate)
    ),
    requiredFields: ['trades.entryDate', 'trades.exitDate'],
    description: 'Add entry and exit times to your trades',
  },
  tradeFrequency: {
    hasEnoughData: journalEntries.some(entry => entry.trades?.length > 0),
    requiredFields: ['trades', 'created_at'],
    description: 'Log your trades consistently',
  },
  winLossRatio: {
    hasEnoughData: journalEntries.filter(entry => entry.outcome).length >= 10,
    requiredFields: ['outcome'],
    description: 'Log the outcome (win/loss) of your trading sessions',
  },
});
