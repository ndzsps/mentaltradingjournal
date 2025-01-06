import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneralSectionProps {
  direction: 'buy' | 'sell' | null;
  setDirection: (direction: 'buy' | 'sell') => void;
}

export const GeneralSection = ({ direction, setDirection }: GeneralSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">General</h3>
      <div className="space-y-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="entryDate">Entry Date</Label>
          <Input
            type="datetime-local"
            id="entryDate"
            name="entryDate"
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="instrument">Instrument *</Label>
          <Input
            type="text"
            id="instrument"
            name="instrument"
            placeholder="e.g., EUR/USD, AAPL"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="setup">Setup</Label>
          <Input
            type="text"
            id="setup"
            name="setup"
            placeholder="Enter your trading setup"
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