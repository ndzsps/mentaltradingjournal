import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTradeDialog = ({ open, onOpenChange }: AddTradeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
        </DialogHeader>
        <form className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">General</h3>
              <div className="space-y-3">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="entryDate">Entry Date</Label>
                  <Input
                    type="datetime-local"
                    id="entryDate"
                    className="w-full"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="instrument">Instrument</Label>
                  <Input
                    type="text"
                    id="instrument"
                    placeholder="e.g., EUR/USD, AAPL"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="setup">Setup</Label>
                  <Input
                    type="text"
                    id="setup"
                    placeholder="Enter your trading setup"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Trade Entry</h3>
              <div className="space-y-3">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    type="number"
                    id="entryPrice"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    type="number"
                    id="quantity"
                    placeholder="Enter lot size or contracts"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Trade
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};