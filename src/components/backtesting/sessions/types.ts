
export interface Session {
  id: string;
  entryDate: string;
  exitDate: string;
  instrument: string;
  setup: string;
  direction: 'buy' | 'sell' | null;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  pnl: number;
  highestPrice: number;
  lowestPrice: number;
  weeklyUrl: string | null;
  dailyUrl: string | null;
  fourHourUrl: string | null;
  oneHourUrl: string | null;
  refinedEntryUrl: string | null;
  duration: string | null;
}
