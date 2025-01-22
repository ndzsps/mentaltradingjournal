import { useState, useEffect } from "react";
import { Trade } from "@/types/trade";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

interface UseTradeFormProps {
  editTrade?: Trade;
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export const useTradeForm = ({ editTrade, onSubmit, onOpenChange }: UseTradeFormProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const isPostSessionEntry = location.pathname === "/journal-entry";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const tradeData: Trade = {
      id: editTrade?.id || crypto.randomUUID(),
      direction: direction as 'buy' | 'sell',
    };

    const fields = [
      'entryDate', 'instrument', 'setup', 'entryPrice', 'quantity', 
      'stopLoss', 'takeProfit', 'exitDate', 'exitPrice', 'pnl', 
      'fees', 'forecastScreenshot', 'resultUrl', 'htfBias'
    ];

    fields.forEach(field => {
      const value = formData.get(field);
      if (value && value !== '') {
        if (['entryPrice', 'exitPrice', 'stopLoss', 'takeProfit', 'quantity', 'pnl', 'fees'].includes(field)) {
          tradeData[field] = parseFloat(value as string);
        } else {
          tradeData[field] = value as string;
        }
      }
    });

    try {
      // Only create a journal entry if we're in the journal entry context
      if (isPostSessionEntry) {
        const { error: journalError } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user?.id,
            session_type: 'trade',
            emotion: 'neutral',
            emotion_detail: 'neutral',
            notes: `Trade entry for ${tradeData.instrument || 'Unknown Instrument'}`,
            trades: [tradeData]
          });

        if (journalError) throw journalError;
      }
      
      onSubmit(tradeData, !!editTrade);
      onOpenChange(false);
      toast.success(editTrade ? "Trade updated successfully!" : "Trade added successfully!");
    } catch (error) {
      console.error('Error managing trade:', error);
      toast.error("Failed to manage trade");
    }
  };

  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);

  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
      
      const fields = [
        { id: 'entryDate', value: editTrade.entryDate },
        { id: 'instrument', value: editTrade.instrument },
        { id: 'setup', value: editTrade.setup },
        { id: 'entryPrice', value: editTrade.entryPrice },
        { id: 'quantity', value: editTrade.quantity },
        { id: 'stopLoss', value: editTrade.stopLoss },
        { id: 'takeProfit', value: editTrade.takeProfit },
        { id: 'exitDate', value: editTrade.exitDate },
        { id: 'exitPrice', value: editTrade.exitPrice },
        { id: 'pnl', value: editTrade.pnl },
        { id: 'fees', value: editTrade.fees },
        { id: 'forecastScreenshot', value: editTrade.forecastScreenshot },
        { id: 'resultUrl', value: editTrade.resultScreenshot },
        { id: 'htfBias', value: editTrade.htfBias }
      ];

      fields.forEach(({ id, value }) => {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element && value !== undefined && value !== null) {
          element.value = value.toString();
        }
      });
    }
  }, [editTrade]);

  return {
    direction,
    setDirection,
    handleSubmit
  };
};