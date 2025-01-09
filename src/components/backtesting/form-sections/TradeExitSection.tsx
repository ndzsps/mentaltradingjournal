import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TradeExitSectionProps {
  formData: {
    exitDate: string;
    exitPrice: number;
    pnl: number;
    fees: number;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TradeExitSection({ formData, onInputChange }: TradeExitSectionProps) {
  return (
    <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
      <h3 className="text-lg font-semibold">Trade Exit</h3>
      
      <div className="space-y-2">
        <Label htmlFor="exitDate">Exit Date</Label>
        <Input
          type="date"
          id="exitDate"
          value={formData.exitDate}
          onChange={onInputChange}
          className="flex-1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="exitPrice">Exit Price</Label>
        <Input
          type="number"
          id="exitPrice"
          value={formData.exitPrice || ''}
          onChange={onInputChange}
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pnl">Profit & Loss</Label>
        <Input
          type="number"
          id="pnl"
          value={formData.pnl || ''}
          onChange={onInputChange}
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fees">Fees</Label>
        <Input
          type="number"
          id="fees"
          value={formData.fees || ''}
          onChange={onInputChange}
          placeholder="0.00"
          step="0.01"
        />
      </div>
    </div>
  );
}