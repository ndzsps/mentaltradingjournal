import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Trade {
  id: string;
  entryDate: string;
  instrument: string;
  setup: string;
  direction: 'buy' | 'sell';
  entryPrice: number | string;
  quantity: number | string;
  stopLoss: number | string;
  takeProfit: number | string;
  exitDate: string;
  exitPrice: number | string;
  pnl: number | string;
  fees: number | string;
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
  followed_rules?: string[];
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

      {/* Display Trading Rules Followed */}
      {Array.isArray(entry.followed_rules) && entry.followed_rules.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Trading Rules Followed:</h4>
          <div className="flex flex-wrap gap-2">
            {entry.followed_rules.map((rule, index) => (
              <Badge 
                key={index}
                variant="outline"
                className="bg-accent/10 hover:bg-accent/20 transition-colors"
              >
                {capitalizeWords(rule)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Display Trades */}
      {Array.isArray(entry.trades) && entry.trades.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Trades</h4>
            <Accordion type="single" collapsible className="w-full">
              {entry.trades.map((trade, index) => (
                <AccordionItem key={trade.id || index} value={`trade-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-medium">{trade.instrument}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={trade.direction === 'buy' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {trade.direction}
                        </Badge>
                        <span className={`font-medium ${
                          Number(trade.pnl) >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {Number(trade.pnl) >= 0 ? '+' : ''}{trade.pnl}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Entry Details</h4>
                          <div className="space-y-1">
                            <p className="text-sm">Date: {new Date(trade.entryDate).toLocaleString()}</p>
                            <p className="text-sm">Price: {trade.entryPrice}</p>
                            <p className="text-sm">Stop Loss: {trade.stopLoss}</p>
                            <p className="text-sm">Take Profit: {trade.takeProfit}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Exit Details</h4>
                          <div className="space-y-1">
                            <p className="text-sm">Date: {new Date(trade.exitDate).toLocaleString()}</p>
                            <p className="text-sm">Price: {trade.exitPrice}</p>
                            <p className="text-sm">Quantity: {trade.quantity}</p>
                            <p className="text-sm">Fees: {trade.fees}</p>
                          </div>
                        </div>
                      </div>
                      {trade.setup && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-muted-foreground">Setup</h4>
                          <p className="text-sm">{trade.setup}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </>
      )}
    </Card>
  );
};