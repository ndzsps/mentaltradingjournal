import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";

interface TradeEntrySectionProps {
  formData: Partial<Trade>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TradeEntrySection = ({ formData, onInputChange }: TradeEntrySectionProps) => {
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
            value={formData.entryPrice || ''}
            onChange={onInputChange}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Enter lot size or contracts"
            value={formData.quantity || ''}
            onChange={onInputChange}
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
            value={formData.stopLoss || ''}
            onChange={onInputChange}
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
            value={formData.takeProfit || ''}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
};