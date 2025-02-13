
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GeneralSectionProps {
  formData: {
    entryDate: string;
    instrument: string;
    setup: string;
  };
  direction: 'buy' | 'sell' | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDirectionSelect: (direction: 'buy' | 'sell') => void;
}

export function GeneralSection({ formData, direction, onInputChange, onDirectionSelect }: GeneralSectionProps) {
  return (
    <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
      <h3 className="text-lg font-semibold">General</h3>
      
      <div className="space-y-2">
        <Label htmlFor="entryDate">Entry Date & Time *</Label>
        <Input
          type="datetime-local"
          id="entryDate"
          value={formData.entryDate}
          onChange={onInputChange}
          className="flex-1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instrument">Instrument *</Label>
        <Input
          id="instrument"
          value={formData.instrument}
          onChange={onInputChange}
          placeholder="e.g., EUR/USD, AAPL"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="setup">Setup</Label>
        <Input
          id="setup"
          value={formData.setup}
          onChange={onInputChange}
          placeholder="Enter your trading setup"
        />
      </div>

      <div className="space-y-2">
        <Label>Direction *</Label>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant={direction === 'buy' ? 'default' : 'outline'}
            onClick={() => onDirectionSelect('buy')}
            className={`w-full ${direction === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-500/10'}`}
          >
            Buy
          </Button>
          <Button
            type="button"
            variant={direction === 'sell' ? 'default' : 'outline'}
            onClick={() => onDirectionSelect('sell')}
            className={`w-full ${direction === 'sell' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-500/10'}`}
          >
            Sell
          </Button>
        </div>
      </div>
    </div>
  );
}
