import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TradeEntrySection = () => {
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
      </div>
    </div>
  );
};