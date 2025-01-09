import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { TradeFormContent } from "./TradeFormContent";
import { Trade } from "@/types/trade";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TradeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tradeData: Trade) => void;
  editTrade?: Trade;
}

export const TradeFormDialog = ({ open, onOpenChange, onSubmit, editTrade }: TradeFormDialogProps) => {
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);

  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
    }
  }, [editTrade]);

  const handleSubmit = (tradeData: Trade) => {
    onSubmit(tradeData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:max-w-[1000px]">
        <div className="p-6 pb-0">
          <DialogTitle>{editTrade ? 'Edit Trade' : 'Add Trade'}</DialogTitle>
        </div>
        <ScrollArea className="flex-1 p-6">
          <TradeFormContent
            direction={direction}
            setDirection={setDirection}
            onSubmit={handleSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};