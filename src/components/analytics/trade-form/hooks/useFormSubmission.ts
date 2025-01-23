import { useState } from "react";
import { toast } from "sonner";
import { Trade } from "@/types/trade";

interface UseFormSubmissionProps {
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export const useFormSubmission = ({ onSubmit, onOpenChange }: UseFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = async (tradeData: Trade, isEdit: boolean) => {
    await onSubmit(tradeData, isEdit);
    onOpenChange(false);
    toast.success(isEdit ? "Trade updated successfully!" : "Trade saved successfully!");
  };

  const handleError = (error: any, isEdit: boolean) => {
    console.error(isEdit ? "Error updating trade:" : "Error saving trade:", error);
    toast.error(isEdit ? "Failed to update trade" : "Failed to save trade");
  };

  return {
    isSubmitting,
    setIsSubmitting,
    handleSuccess,
    handleError
  };
};