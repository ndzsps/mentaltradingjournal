import { Trade } from "@/types/trade";
import { FormSections } from "./form-sections/FormSections";
import { FormActions } from "./form-sections/FormActions";
import { useTradeForm } from "./hooks/useTradeForm";

interface TradeFormContentProps {
  direction: 'buy' | 'sell' | null;
  setDirection: (direction: 'buy' | 'sell') => void;
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  editTrade?: Trade;
  onOpenChange: (open: boolean) => void;
}

export const TradeFormContent = ({ 
  direction, 
  setDirection, 
  onSubmit, 
  editTrade, 
  onOpenChange 
}: TradeFormContentProps) => {
  const { handleSubmit } = useTradeForm({
    editTrade,
    onSubmit,
    onOpenChange
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <FormSections direction={direction} setDirection={setDirection} />
      <FormActions isEdit={!!editTrade} />
    </form>
  );
};