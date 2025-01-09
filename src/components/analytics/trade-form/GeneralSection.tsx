import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";

interface GeneralSectionProps {
  direction: 'buy' | 'sell' | null;
  setDirection: (direction: 'buy' | 'sell') => void;
  formData: Partial<Trade>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralSection = ({ 
  direction, 
  setDirection,
  formData,
  onInputChange
}: GeneralSectionProps) => {
  const setTodayDate = (inputId: string) => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.value = localDateTime;
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">General</h3>
      <div className="space-y-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="entryDate">Entry Date</Label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              id="entryDate"
              name="entryDate"
              className="w-full"
              value={formData.entryDate || ''}
              onChange={onInputChange}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setTodayDate('entryDate')}
            >
              Today
            </Button>
          </div>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="instrument">Instrument *</Label>
          <Input
            type="text"
            id="instrument"
            name="instrument"
            placeholder="e.g., EUR/USD, AAPL"
            value={formData.instrument || ''}
            onChange={onInputChange}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="setup">Setup</Label>
          <Input
            type="text"
            id="setup"
            name="setup"
            placeholder="Enter your trading setup"
            value={formData.setup || ''}
            onChange={onInputChange}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label>Direction *</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={direction === 'buy' ? 'default' : 'outline'}
              className={direction === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => setDirection('buy')}
            >
              Buy
            </Button>
            <Button
              type="button"
              size="sm"
              variant={direction === 'sell' ? 'default' : 'outline'}
              className={direction === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
              onClick={() => setDirection('sell')}
            >
              Sell
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};