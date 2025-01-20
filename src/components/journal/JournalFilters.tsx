import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TradeFormDialog } from "@/components/analytics/trade-form/TradeFormDialog";
import { Trade } from "@/types/trade";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  trades: any[];
}

export const JournalFilters = () => {
  const navigate = useNavigate();
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const { user } = useAuth();

  const handleTradeSubmit = async (tradeData: Trade, isEdit: boolean) => {
    if (!user) return;

    try {
      // First, check for an existing post-session entry for the trade's date
      const tradeDate = tradeData.entryDate ? new Date(tradeData.entryDate) : new Date();
      const startOfDay = new Date(tradeDate.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(tradeDate.setHours(23, 59, 59, 999)).toISOString();

      const { data: existingEntry, error: fetchError } = await supabase
        .from('journal_entries')
        .select('id, trades')
        .eq('user_id', user.id)
        .eq('session_type', 'post')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let entryId;

      if (!existingEntry) {
        // Create a new post-session entry if none exists
        const { data: newEntry, error: createError } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            session_type: 'post',
            emotion: 'neutral',
            emotion_detail: 'neutral',
            notes: 'Auto-generated for trade entry',
            trades: []
          })
          .select('id')
          .single();

        if (createError) throw createError;
        entryId = newEntry.id;
      } else {
        entryId = existingEntry.id;
      }

      // Convert trade data to JSON-compatible format
      const jsonTrade = {
        id: tradeData.id,
        instrument: tradeData.instrument || '',
        direction: tradeData.direction || '',
        entryDate: tradeData.entryDate || '',
        exitDate: tradeData.exitDate || '',
        entryPrice: tradeData.entryPrice?.toString() || '',
        exitPrice: tradeData.exitPrice?.toString() || '',
        stopLoss: tradeData.stopLoss?.toString() || '',
        takeProfit: tradeData.takeProfit?.toString() || '',
        quantity: tradeData.quantity?.toString() || '',
        fees: tradeData.fees?.toString() || '',
        setup: tradeData.setup || '',
        pnl: tradeData.pnl?.toString() || '',
        forecastScreenshot: tradeData.forecastScreenshot || '',
        resultScreenshot: tradeData.resultScreenshot || '',
      };

      // Get current trades and append new trade
      const { data: currentEntry, error: getError } = await supabase
        .from('journal_entries')
        .select('trades')
        .eq('id', entryId)
        .single();

      if (getError) throw getError;

      const updatedTrades = [...(currentEntry.trades || []), jsonTrade];

      // Update the entry with the new trades array
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: updatedTrades })
        .eq('id', entryId);

      if (updateError) throw updateError;
      
      toast.success("Trade added successfully");
      setIsTradeFormOpen(false);

    } catch (error) {
      console.error('Error managing trade:', error);
      toast.error("Failed to save trade");
    }
  };

  return (
    <div className="flex gap-2 justify-start">
      <Button 
        variant="outline" 
        onClick={() => navigate('/add-journal-entry/pre-session')}
      >
        Pre-Session
      </Button>
      <Button 
        variant="outline"
        onClick={() => setIsTradeFormOpen(true)}
        className="gap-1"
      >
        <Plus className="h-4 w-4" /> Add Trade
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('/add-journal-entry/post-session')}
      >
        Post-Session
      </Button>

      <TradeFormDialog
        open={isTradeFormOpen}
        onOpenChange={setIsTradeFormOpen}
        onSubmit={handleTradeSubmit}
      />
    </div>
  );
};