import { Trade } from "@/types/trade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TradesListProps {
  trades: Trade[];
}

export const TradesList = ({ trades }: TradesListProps) => {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {trades.map((trade, index) => (
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

              {trade.screenshots && trade.screenshots.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Screenshots</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {trade.screenshots.map((screenshot, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={screenshot}
                            alt={`Trade screenshot ${idx + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trade.url && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Reference URL</h4>
                  <a 
                    href={trade.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-primary hover:underline"
                  >
                    {trade.url}
                  </a>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};