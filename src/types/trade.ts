export interface Trade {
  id: string;
  instrument: string;
  direction: "buy" | "sell";
  quantity: string;
  entryPrice: string;
  exitPrice: string;
  stopLoss: string;
  takeProfit: string;
  entryDate: string;
  exitDate: string;
  setup: string;
  fees: string;
  pnl: string;
  screenshots?: string[];
  url?: string;
}