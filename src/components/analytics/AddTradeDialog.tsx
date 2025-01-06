import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTradeDialog = ({ open, onOpenChange }: AddTradeDialogProps) => {
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const tradeData = {
      entryDate: formData.get('entryDate'),
      instrument: formData.get('instrument'),
      setup: formData.get('setup'),
      direction: direction,
      entryPrice: formData.get('entryPrice'),
      quantity: formData.get('quantity'),
      stopLoss: formData.get('stopLoss'),
      takeProfit: formData.get('takeProfit'),
      exitDate: formData.get('exitDate'),
      exitPrice: formData.get('exitPrice'),
      pnl: formData.get('pnl'),
      fees: formData.get('fees'),
    };

    // Validate required fields
    if (!tradeData.instrument || !tradeData.direction || !tradeData.entryPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Trade submitted:", tradeData);
    toast.success("Trade added successfully!");
    onOpenChange(false); // Close dialog after successful submission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
          <DialogDescription>
            Fill in the details of your trade. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
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

          <div className="col-span-3">
            <Button type="submit" className="w-full">
              Add Trade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};