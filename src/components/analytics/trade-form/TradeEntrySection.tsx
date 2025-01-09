import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2Icon } from "lucide-react";
import { useState } from "react";

export const TradeEntrySection = () => {
  const [showForecastUrl, setShowForecastUrl] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Trade Entry</h3>
      <div className="space-y-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="entryPrice">Entry Price *</Label>
          <Input
            type="number"
            id="entryPrice"
            name="entryPrice"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Enter lot size or contracts"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="stopLoss">Stop Loss</Label>
          <Input
            type="number"
            id="stopLoss"
            name="stopLoss"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="takeProfit">Take Profit</Label>
          <Input
            type="number"
            id="takeProfit"
            name="takeProfit"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Forecast</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                name="forecastImage"
                className="cursor-pointer file:cursor-pointer file:border-0 file:bg-primary/10 file:text-primary file:px-2 file:py-1 file:mr-2 file:rounded-md hover:file:bg-primary/20 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowForecastUrl(!showForecastUrl)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title="Toggle URL input"
              >
                <Link2Icon className="w-4 h-4" />
              </button>
            </div>
            {showForecastUrl && (
              <Input
                type="url"
                name="forecastUrl"
                placeholder="Enter image URL"
                className="text-sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};