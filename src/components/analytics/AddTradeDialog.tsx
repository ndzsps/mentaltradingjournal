
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
    
    // Immediately start refetch to minimize delay
    await Promise.all([
      queryClient.invalidateQueries({ 
        queryKey: ['journal-entries'],
        refetchType: 'active'
      }),
      queryClient.invalidateQueries({ 
        queryKey: ['analytics'],
        refetchType: 'active'
      }),
      queryClient.invalidateQueries({ 
        queryKey: ['weekly-performance'],
        refetchType: 'active'
      })
    ]);
    
    // Force an immediate refetch
    await Promise.all([
      queryClient.refetchQueries({ 
        queryKey: ['journal-entries'],
        exact: true
      }),
      queryClient.refetchQueries({ 
        queryKey: ['analytics'],
        exact: true
      }),
      queryClient.refetchQueries({ 
        queryKey: ['weekly-performance'],
        exact: true
      })
    ]);
  };

  return (
    <TradeFormDialog 
      open={props.open} 
      onOpenChange={props.onOpenChange} 
      onSubmit={handleTradeSubmit}
      editTrade={props.editTrade}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Add Trade</Button>
      </DialogTrigger>
    </TradeFormDialog>
  );
};
