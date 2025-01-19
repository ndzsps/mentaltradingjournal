import { Trade } from "@/types/trade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TradesListProps {
  trades: Trade[];
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const TradesList = ({ trades }: TradesListProps) => {
  console.log('TradesList - Received trades:', trades);
  
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {trades.map((trade, index) => {
        console.log(`Trade ${index}:`, trade);
        console.log(`Trade ${index} screenshots:`, {
          forecast: trade.forecastScreenshot,
          result: trade.resultScreenshot
        });
        
        return (
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
                      <p className="text-sm">Date: {formatDate(trade.entryDate || '')}</p>
                      <p className="text-sm">Price: {trade.entryPrice}</p>
                      <p className="text-sm">Stop Loss: {trade.stopLoss}</p>
                      <p className="text-sm">Take Profit: {trade.takeProfit}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Exit Details</h4>
                    <div className="space-y-2">
                      <p className="text-sm">Date: {formatDate(trade.exitDate || '')}</p>
                      <p className="text-sm">Price: {trade.exitPrice}</p>
                      <p className="text-sm">Quantity: {trade.quantity}</p>
                      <p className="text-sm">Fees: {trade.fees}</p>
                    </div>
                  </div>
                </div>

                {(trade.forecastScreenshot || trade.resultScreenshot) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Trade Screenshots</h4>
                      <div className="flex gap-4">
                        {trade.forecastScreenshot && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open(trade.forecastScreenshot, '_blank')}
                          >
                            View Forecast <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        {trade.resultScreenshot && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open(trade.resultScreenshot, '_blank')}
                          >
                            View Result <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {trade.setup && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Setup</h4>
                    <p className="text-sm">{trade.setup}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};