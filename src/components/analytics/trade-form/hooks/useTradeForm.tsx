import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types/trade";
import { toast } from "sonner";

interface UseTradeFormProps {
  editTrade?: Trade;
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export const useTradeForm = ({ editTrade, onSubmit, onOpenChange }: UseTradeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const tradeData = {
        entryDate: formData.get("entryDate") as string,
        instrument: formData.get("instrument") as string,
        setup: formData.get("setup") as string,
        direction: formData.get("direction") as string,
        entryPrice: parseFloat(formData.get("entryPrice") as string),
        exitPrice: parseFloat(formData.get("exitPrice") as string),
        quantity: parseFloat(formData.get("quantity") as string),
        stopLoss: parseFloat(formData.get("stopLoss") as string),
        takeProfit: parseFloat(formData.get("takeProfit") as string),
        pnl: parseFloat(formData.get("pnl") as string),
        fees: parseFloat(formData.get("fees") as string),
        exitDate: formData.get("exitDate") as string,
        forecastScreenshot: formData.get("forecastScreenshot") as string,
        resultUrl: formData.get("resultUrl") as string,
      };

      const tradeObject = {
        id: editTrade?.id || crypto.randomUUID(),
        entryDate: tradeData.entryDate,
        exitDate: tradeData.exitDate,
        instrument: tradeData.instrument,
        setup: tradeData.setup,
        direction: tradeData.direction,
        entryPrice: tradeData.entryPrice,
        exitPrice: tradeData.exitPrice,
        quantity: tradeData.quantity,
        stopLoss: tradeData.stopLoss,
        takeProfit: tradeData.takeProfit,
        pnl: tradeData.pnl,
        fees: tradeData.fees,
        forecastScreenshot: tradeData.forecastScreenshot,
        resultUrl: tradeData.resultUrl,
      };

      // Create a trade entry without session type and emotion
      const { error: tradeError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user?.id,
          notes: `Trade: ${tradeData.instrument || 'Unknown Instrument'} - PNL: ${tradeData.pnl}`,
          trades: [tradeObject]
        });

      if (tradeError) {
        throw tradeError;
      }

      await onSubmit(tradeObject as Trade, !!editTrade);
      onOpenChange(false);
      toast.success("Trade saved successfully!");
    } catch (error: any) {
      console.error("Error saving trade:", error);
      toast.error("Failed to save trade. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
};