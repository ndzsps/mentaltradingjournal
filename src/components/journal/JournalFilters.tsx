import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AddTradeDialog } from "@/components/analytics/AddTradeDialog";
import { Trade } from "@/types/trade";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const JournalFilters = () => {
  const navigate = useNavigate();
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const { user } = useAuth();

  const handleTradeSubmit = async (tradeData: Trade, isEdit: boolean) => {
    if (!user) return;

    try {
      const entryDate = tradeData.entryDate ? new Date(tradeData.entryDate) : new Date();
      const startOfDay = new Date(entryDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(entryDate);
      endOfDay.setHours(23, 59, 59, 999);

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
        htfBias: tradeData.htfBias || ''
      };

      // Check for existing journal entry for this day
      const { data: existingEntries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

      if (existingEntries && existingEntries.length > 0) {
        const existingEntry = existingEntries[0];
        const updatedTrades = [...(existingEntry.trades || []), jsonTrade];
        
        const { error: updateError } = await supabase
          .from('journal_entries')
          .update({ trades: updatedTrades })
          .eq('id', existingEntry.id);

        if (updateError) throw updateError;
      } else {
        const { error: createError } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            session_type: 'trade',
            emotion: 'neutral',
            emotion_detail: 'neutral',
            notes: `Trade entry for ${tradeData.instrument || 'Unknown Instrument'}`,
            trades: [jsonTrade]
          });

        if (createError) throw createError;
      }
      
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
        onClick={() => navigate('/journal-entry')}
      >
        Pre-Session
      </Button>
      <AddTradeDialog
        open={isTradeFormOpen}
        onOpenChange={setIsTradeFormOpen}
        onSubmit={handleTradeSubmit}
      />
      <Button 
        variant="outline"
        onClick={() => navigate('/journal-entry')}
      >
        Post-Session
      </Button>
    </div>
  );
};