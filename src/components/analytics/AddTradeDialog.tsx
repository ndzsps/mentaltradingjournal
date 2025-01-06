import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { GeneralSection } from "./trade-form/GeneralSection";
import { TradeEntrySection } from "./trade-form/TradeEntrySection";
import { TradeExitSection } from "./trade-form/TradeExitSection";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTradeDialog = ({ open, onOpenChange }: AddTradeDialogProps) => {
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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

    if (!tradeData.instrument || !tradeData.direction || !tradeData.entryPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Trade submitted:", tradeData);
    toast.success("Trade added successfully!");
    onOpenChange(false);
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
          <GeneralSection direction={direction} setDirection={setDirection} />
          <TradeEntrySection />
          <TradeExitSection />
          
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