export interface Trade {
  id: string;
  entryDate: string;
  instrument: string;
  setup: string;
  direction: 'buy' | 'sell';
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  exitDate: string;
  exitPrice: number;
  pnl: number;
  profit_loss?: number; // Adding this optional field for backward compatibility
  fees: number;
  forecastScreenshot?: string;
  resultScreenshot?: string;
}