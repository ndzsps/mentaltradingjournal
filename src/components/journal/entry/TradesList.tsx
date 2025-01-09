import { Trade } from "@/types/trade";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, ImageIcon, Link2Icon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isValid, parseISO } from "date-fns";

interface TradesListProps {
  trades: Trade[];
}

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return "Invalid date";
    }
    return format(date, "M/d/yyyy, h:mm:ss a");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const TradesList = ({ trades }: TradesListProps) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {trades.map((trade) => (
          <Card key={trade.id} className="p-4 bg-card/50">
            <div className="space-y-4">
              {/* Header with Instrument and PnL */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{trade.instrument}</h3>
                  <Badge variant={trade.direction === "buy" ? "default" : "destructive"}>
                    {trade.direction === "buy" ? (
                      <ArrowUpIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-1" />
                    )}
                    {trade.direction.toUpperCase()}
                  </Badge>
                </div>
                <Badge 
                  variant={Number(trade.pnl) >= 0 ? "outline" : "destructive"}
                  className={`text-lg ${
                    Number(trade.pnl) >= 0 
                      ? "border-green-500/50 text-green-500 bg-green-500/5" 
                      : "border-red-500/50 text-red-500 bg-red-500/5"
                  }`}
                >
                  {Number(trade.pnl) >= 0 ? "+" : ""}{trade.pnl}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Entry Details */}
                <div className="space-y-3">
                  <h4 className="text-lg text-muted-foreground">Entry Details</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{formatDate(trade.entryDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">{trade.entryPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stop Loss</p>
                      <p className="font-medium">{trade.stopLoss}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Take Profit</p>
                      <p className="font-medium">{trade.takeProfit}</p>
                    </div>
                    {(trade.forecastImage || trade.forecastUrl) && (
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" /> Forecast
                        </p>
                        {trade.forecastImage ? (
                          <img 
                            src={trade.forecastImage} 
                            alt="Trade Forecast" 
                            className="mt-1 rounded-md w-full h-32 object-cover"
                          />
                        ) : trade.forecastUrl && (
                          <a 
                            href={trade.forecastUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            <Link2Icon className="w-4 h-4" /> View Forecast
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Exit Details */}
                <div className="space-y-3">
                  <h4 className="text-lg text-muted-foreground">Exit Details</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{formatDate(trade.exitDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">{trade.exitPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">{trade.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fees</p>
                      <p className="font-medium">{trade.fees}</p>
                    </div>
                    {(trade.resultImage || trade.resultUrl) && (
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" /> Result
                        </p>
                        {trade.resultImage ? (
                          <img 
                            src={trade.resultImage} 
                            alt="Trade Result" 
                            className="mt-1 rounded-md w-full h-32 object-cover"
                          />
                        ) : trade.resultUrl && (
                          <a 
                            href={trade.resultUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            <Link2Icon className="w-4 h-4" /> View Result
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Setup Section */}
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Setup</p>
                <p className="font-medium">{trade.setup}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};