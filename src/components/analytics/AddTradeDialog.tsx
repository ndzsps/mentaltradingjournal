import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TradeFormDialog } from "./trade-form/TradeFormDialog";
import { useQueryClient } from "@tanstack/react-query";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tradeData: any, isEdit: boolean) => void;
  editTrade?: any;
}

export const AddTradeDialog = (props: AddTradeDialogProps) => {
  const queryClient = useQueryClient();

  const handleTradeSubmit = async (tradeData: any, isEdit: boolean) => {
    await props.onSubmit(tradeData, isEdit);
    // Invalidate and refetch queries to update the UI
    queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
    queryClient.invalidateQueries({ queryKey: ['weekly-performance'] });
  };

  return (
    <TradeFormDialog {...props} onSubmit={handleTradeSubmit}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Trade</Button>
      </DialogTrigger>
    </TradeFormDialog>
  );
};