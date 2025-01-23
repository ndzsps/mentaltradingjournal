import { Trade } from "@/types/trade";
import { useAuth } from "@/contexts/AuthContext";
import { useFormSubmission } from "./useFormSubmission";
import { 
  findTradeEntry, 
  createTradeObject, 
  updateExistingTrade, 
  createNewTrade 
} from "../utils/tradeOperations";

interface UseTradeFormProps {
  editTrade?: Trade;
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export const useTradeForm = ({ editTrade, onSubmit, onOpenChange }: UseTradeFormProps) => {
  const { user } = useAuth();
  const { 
    isSubmitting, 
    setIsSubmitting, 
    handleSuccess, 
    handleError 
  } = useFormSubmission({ onSubmit, onOpenChange });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const tradeData = createTradeObject(formData);

      if (editTrade) {
        const entry = await findTradeEntry(editTrade.id);
        await updateExistingTrade(entry, editTrade, tradeData);
      } else {
        if (!user?.id) throw new Error('User not found');
        await createNewTrade(tradeData, user.id);
      }

      await handleSuccess(tradeData, !!editTrade);
    } catch (error) {
      handleError(error, !!editTrade);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
};