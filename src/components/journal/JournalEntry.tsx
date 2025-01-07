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
    <Card className="p-6 rounded-lg bg-background/50 border border-primary/10 min-h-[400px]">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge 
            variant={entry.session_type === 'pre' ? 'default' : 'secondary'}
            className="capitalize px-4 py-1"
          >
            {entry.session_type}-Session
          </Badge>
          <Badge 
            variant="outline" 
            className="bg-accent/10 hover:bg-accent/20 transition-colors px-4 py-1"
          >
            {capitalizeWords(entry.emotion)} - {capitalizeWords(entry.emotion_detail)}
          </Badge>
          {entry.session_type === 'post' && entry.outcome && (
            <Badge 
              variant="outline" 
              className={`capitalize px-4 py-1 ${
                entry.outcome === 'loss' 
                  ? 'border-red-500/50 text-red-500 bg-red-500/5 hover:bg-red-500/10' 
                  : 'border-green-500/50 text-green-500 bg-green-500/5 hover:bg-green-500/10'
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
      {entry.market_conditions && (
        <p className="text-sm text-muted-foreground mb-3">
          Market Conditions: {capitalizeWords(entry.market_conditions)}
        </p>
      )}
      <p className="mt-2 text-sm text-foreground/90 mb-4">
        {entry.notes}
      </p>

      {/* Display Trading Rules Followed */}
      {Array.isArray(entry.followed_rules) && entry.followed_rules.length > 0 && (
        <div className="mt-4 mb-6">
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
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Trades</h4>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {entry.trades.map((trade, index) => (
                <AccordionItem key={trade.id || index} value={`trade-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-medium">{trade.instrument}</span>
                      <div className="flex items-center gap-3">
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
                  <AccordionContent className="pb-4">
                    <div className="space-y-6 pt-2">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Entry Details</h4>
                          <div className="space-y-2">
                            <p className="text-sm">Date: {new Date(trade.entryDate).toLocaleString()}</p>
                            <p className="text-sm">Price: {trade.entryPrice}</p>
                            <p className="text-sm">Stop Loss: {trade.stopLoss}</p>
                            <p className="text-sm">Take Profit: {trade.takeProfit}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Exit Details</h4>
                          <div className="space-y-2">
                            <p className="text-sm">Date: {new Date(trade.exitDate).toLocaleString()}</p>
                            <p className="text-sm">Price: {trade.exitPrice}</p>
                            <p className="text-sm">Quantity: {trade.quantity}</p>
                            <p className="text-sm">Fees: {trade.fees}</p>
                          </div>
                        </div>
                      </div>
                      {trade.setup && (
                        <div className="space-y-2">
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