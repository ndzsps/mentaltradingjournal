import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Trade {
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
  fees: number;
}

interface JournalEntry {
  id: string;
  created_at: string;
  session_type: string;
  emotion: string;
  emotion_detail: string;
  notes: string;
  outcome?: string;
  market_conditions?: string;
  trades?: Trade[];
}

interface JournalEntryProps {
  entry: JournalEntry;
}

const capitalizeWords = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const JournalEntry = ({ entry }: JournalEntryProps) => {
  const formattedDate = new Date(entry.created_at).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="p-4 rounded-lg bg-background/50 border border-primary/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant={entry.session_type === 'pre' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {entry.session_type}-Session
          </Badge>
          {entry.session_type === 'post' && entry.outcome && (
            <Badge 
              variant="outline" 
              className={`capitalize ${
                entry.outcome === 'loss' 
                  ? 'border-red-500/50 text-red-500' 
                  : 'border-accent/50 text-accent-foreground'
              }`}
            >
              {capitalizeWords(entry.outcome)}
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {formattedDate}
        </span>
      </div>
      <p className="font-medium text-foreground mb-1">
        Feeling: {capitalizeWords(entry.emotion)} - {capitalizeWords(entry.emotion_detail)}
      </p>
      {entry.market_conditions && (
        <p className="text-sm text-muted-foreground">
          Market Conditions: {capitalizeWords(entry.market_conditions)}
        </p>
      )}
      <p className="mt-2 text-sm text-foreground/90">
        {entry.notes}
      </p>

      {entry.trades && entry.trades.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Trades</h3>
            {entry.trades.map((trade, index) => (
              <div key={trade.id || index} className="bg-card/50 p-3 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{trade.instrument}</span>
                  <Badge 
                    variant={trade.direction === 'buy' ? 'default' : 'destructive'}
                    className="capitalize"
                  >
                    {trade.direction}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry</p>
                    <p>{new Date(trade.entryDate).toLocaleString()}</p>
                    <p>Price: {trade.entryPrice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Exit</p>
                    <p>{new Date(trade.exitDate).toLocaleString()}</p>
                    <p>Price: {trade.exitPrice}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quantity: {trade.quantity}</span>
                  <span className={`font-medium ${
                    Number(trade.pnl) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    P&L: {Number(trade.pnl) >= 0 ? '+' : ''}{trade.pnl}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};