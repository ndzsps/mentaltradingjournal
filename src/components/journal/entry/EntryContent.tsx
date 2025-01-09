import { Separator } from "@/components/ui/separator";
import { TradesList } from "./TradesList";
import { TradingRules } from "./TradingRules";
import { Trade } from "@/types/trade";

interface EntryContentProps {
  marketConditions?: string;
  notes?: string;
  followedRules?: string[];
  trades?: Trade[];
}

const capitalizeWords = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const EntryContent = ({ 
  marketConditions, 
  notes, 
  followedRules, 
  trades 
}: EntryContentProps) => {
  return (
    <div className="space-y-6">
      {marketConditions && (
        <p className="text-sm text-muted-foreground">
          Market Conditions: {capitalizeWords(marketConditions)}
        </p>
      )}
      
      {notes && (
        <p className="text-sm text-foreground/90">
          {notes}
        </p>
      )}

      {followedRules && <TradingRules rules={followedRules} />}

      {Array.isArray(trades) && trades.length > 0 && (
        <div>
          <Separator className="mb-6" />
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Trades</h4>
            <TradesList trades={trades} />
          </div>
        </div>
      )}
    </div>
  );
};