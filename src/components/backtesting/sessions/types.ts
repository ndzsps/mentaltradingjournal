export interface Session {
  id: string;
  entryDate: string;
  instrument: string;
  setup: string;
  direction: 'buy' | 'sell' | null;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  pnl: number;
  weeklyUrl: string | null;
  dailyUrl: string | null;
  fourHourUrl: string | null;
  oneHourUrl: string | null;
  refinedEntryUrl: string | null;
}