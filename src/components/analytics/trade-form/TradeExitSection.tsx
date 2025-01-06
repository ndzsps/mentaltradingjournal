import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TradeExitSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Trade Exit</h3>
      <div className="space-y-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="exitDate">Exit Date</Label>
          <Input
            type="datetime-local"
            id="exitDate"
            name="exitDate"
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="exitPrice">Exit Price</Label>
          <Input
            type="number"
            id="exitPrice"
            name="exitPrice"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="pnl">Profit & Loss</Label>
          <Input
            type="number"
            id="pnl"
            name="pnl"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="fees">Fees</Label>
          <Input
            type="number"
            id="fees"
            name="fees"
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};