import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TradeFormDialog } from "./trade-form/TradeFormDialog";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tradeData: any, isEdit: boolean) => void;
  editTrade?: any;
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