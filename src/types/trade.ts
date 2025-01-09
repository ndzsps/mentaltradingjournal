export interface Trade {
  id: string;
  direction: "buy" | "sell";
  instrument: string;
  setup: string;
  entryDate: string;
  entryPrice: string;
  exitDate: string;
  exitPrice: string;
  quantity: string;
  takeProfit: string;
  stopLoss: string;
  fees: string;
  pnl: string;
  forecastImage?: string;
  forecastUrl?: string;
  resultImage?: string;
  resultUrl?: string;
}