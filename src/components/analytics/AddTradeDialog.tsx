import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TradeFormDialog } from "./trade-form/TradeFormDialog";
import { Trade } from "@/types/trade";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tradeData: Trade) => void;
  editTrade?: Trade;
}

export const AddTradeDialog = (props: AddTradeDialogProps) => {
  return (
    <TradeFormDialog {...props}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Trade</Button>
      </DialogTrigger>
    </TradeFormDialog>
  );
};