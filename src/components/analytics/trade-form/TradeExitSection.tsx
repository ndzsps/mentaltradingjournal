import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TradeExitSection = () => {
  const setTodayDate = (inputId: string) => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.value = localDateTime;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Trade Exit</h3>
      <div className="space-y-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="exitDate">Exit Date</Label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              id="exitDate"
              name="exitDate"
              className="w-full"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setTodayDate('exitDate')}
            >
              Today
            </Button>
          </div>
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
          <Label htmlFor="takeProfit">Take Profit</Label>
          <Input
            type="number"
            id="takeProfit"
            name="takeProfit"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="resultUrl">Result</Label>
          <Input
            type="url"
            id="resultUrl"
            name="resultUrl"
            placeholder="Enter result screenshot URL"
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