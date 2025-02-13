
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TradeExitSectionProps {
  formData: {
    exitDate: string;
    exitPrice: number;
    pnl: number;
    highestPrice: number;
    lowestPrice: number;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TradeExitSection({ formData, onInputChange }: TradeExitSectionProps) {
  const setTodayDateTime = () => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    const input = document.getElementById('exitDate') as HTMLInputElement;
    if (input) {
      input.value = localDateTime;
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
      <h3 className="text-lg font-semibold">Trade Exit</h3>
      
      <div className="space-y-2">
        <Label htmlFor="exitDate">Exit Date & Time</Label>
        <div className="flex gap-2">
          <Input
            type="datetime-local"
            id="exitDate"
            value={formData.exitDate}
            onChange={onInputChange}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={setTodayDateTime}
          >
            Now
          </Button>
        </div>
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
        <Label htmlFor="highestPrice">Highest Price</Label>
        <Input
          type="number"
          id="highestPrice"
          value={formData.highestPrice || ''}
          onChange={onInputChange}
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lowestPrice">Lowest Price</Label>
        <Input
          type="number"
          id="lowestPrice"
          value={formData.lowestPrice || ''}
          onChange={onInputChange}
          placeholder="0.00"
          step="0.01"
        />
      </div>
    </div>
  );
}
