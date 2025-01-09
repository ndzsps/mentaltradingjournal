import { Trade } from "@/types/trade";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface TradesListProps {
  trades: Trade[];
}

export const TradesList = ({ trades }: TradesListProps) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {trades.map((trade) => (
          <Card key={trade.id} className="p-4 bg-card/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={trade.direction === "buy" ? "default" : "destructive"}>
                    {trade.direction === "buy" ? (
                      <ArrowUpIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-1" />
                    )}
                    {trade.direction.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium">{trade.instrument}</span>
                </div>
                <Badge 
                  variant={Number(trade.pnl) >= 0 ? "outline" : "destructive"}
                  className={`${
                    Number(trade.pnl) >= 0 
                      ? "border-green-500/50 text-green-500 bg-green-500/5" 
                      : "border-red-500/50 text-red-500 bg-red-500/5"
                  }`}
                >
                  {Number(trade.pnl) >= 0 ? "+" : ""}{trade.pnl}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Setup</p>
                  <p>{trade.setup}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p>{trade.quantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Entry</p>
                  <p className="font-medium">{trade.entryPrice}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(trade.entryDate), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Exit</p>
                  <p className="font-medium">{trade.exitPrice}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(trade.exitDate), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Stop Loss</p>
                  <p>{trade.stopLoss}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Take Profit</p>
                  <p>{trade.takeProfit}</p>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">Fees</p>
                <p>{trade.fees}</p>
              </div>

              {/* Screenshots Section */}
              {(trade.forecastImage || trade.forecastUrl || trade.resultImage || trade.resultUrl) && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Screenshots</p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Forecast Image/URL */}
                    {(trade.forecastImage || trade.forecastUrl) && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Forecast</p>
                        {trade.forecastImage ? (
                          <img 
                            src={trade.forecastImage} 
                            alt="Trade Forecast" 
                            className="rounded-md w-full h-32 object-cover"
                          />
                        ) : trade.forecastUrl && (
                          <a 
                            href={trade.forecastUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline break-all"
                          >
                            {trade.forecastUrl}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Result Image/URL */}
                    {(trade.resultImage || trade.resultUrl) && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Result</p>
                        {trade.resultImage ? (
                          <img 
                            src={trade.resultImage} 
                            alt="Trade Result" 
                            className="rounded-md w-full h-32 object-cover"
                          />
                        ) : trade.resultUrl && (
                          <a 
                            href={trade.resultUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline break-all"
                          >
                            {trade.resultUrl}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};