import { Separator } from "@/components/ui/separator";
import { TradesList } from "./TradesList";
import { TradingRules } from "./TradingRules";
import { Trade } from "@/types/trade";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface EntryContentProps {
  marketConditions?: string;
  notes?: string;
  followedRules?: string[];
  trades?: Trade[];
  screenshots?: string[];
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
  trades,
  screenshots
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

      {screenshots && screenshots.length > 0 && (
        <div>
          <Separator className="mb-6" />
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Screenshots</h4>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {screenshots.map((url, index) => (
                  <a 
                    key={index} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors"
                  >
                    <img
                      src={url}
                      alt={`Trade screenshot ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </a>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

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