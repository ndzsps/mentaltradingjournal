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

      if (editTrade) {
        // Get the journal entry containing this trade
        const { data: entries, error: fetchError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('session_type', 'trade')
          .contains('trades', [{ id: editTrade.id }]);

        if (fetchError) throw fetchError;
        if (!entries || entries.length === 0) throw new Error('Journal entry not found');

        const entry = entries[0];
        const updatedTrades = entry.trades.map((trade: Trade) => 
          trade.id === editTrade.id ? { ...trade, ...tradeData, id: editTrade.id } : trade
        );

        // Update the journal entry with the modified trades array
        const { error: updateError } = await supabase
          .from('journal_entries')
          .update({ trades: updatedTrades })
          .eq('id', entry.id);

        if (updateError) throw updateError;
      } else {
        // Create a new trade entry
        const tradeObject = {
          id: crypto.randomUUID(),
          ...tradeData
        };

        const { error: tradeError } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user?.id,
            notes: `Trade entry for ${tradeData.instrument}`,
            trades: [tradeObject],
            session_type: 'trade',
            emotion: 'neutral',    
            emotion_detail: 'neutral'
          });

        if (tradeError) throw tradeError;
      }

      await onSubmit(tradeData as Trade, !!editTrade);
      onOpenChange(false);
      toast.success(editTrade ? "Trade updated successfully!" : "Trade saved successfully!");
    } catch (error: any) {
      console.error(editTrade ? "Error updating trade:" : "Error saving trade:", error);
      toast.error(editTrade ? "Failed to update trade" : "Failed to save trade");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
};