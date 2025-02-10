
import { useState } from "react";
import { Trade } from "@/types/trade";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export const useTradeActions = (user: User | null) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTrade || !user) return;

    try {
      console.log('Deleting trade:', selectedTrade);
      
      const { data: entries, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Error fetching entries:', fetchError);
        throw fetchError;
      }

      const entryWithTrade = entries?.find(entry => 
        entry.trades?.some((trade: Trade) => trade.id === selectedTrade.id)
      );

      if (!entryWithTrade) {
        console.error('No entry found containing the trade');
        throw new Error('Journal entry not found');
      }

      const updatedTrades = entryWithTrade.trades.filter(
        (trade: Trade) => trade.id !== selectedTrade.id
      );

      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: updatedTrades })
        .eq('id', entryWithTrade.id);

      if (updateError) {
        console.error('Error updating entry:', updateError);
        throw updateError;
      }

      toast.success('Trade deleted successfully');
      setIsDeleteDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast.error('Failed to delete trade');
    }
  };

  const handleTradeUpdate = async (updatedTrade: Trade) => {
    if (!user) {
      toast.error('You must be logged in to update trades');
      return;
    }

    setIsUpdating(true);
    
    try {
      // Get all journal entries for trades
      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      // Find the entry containing our trade
      const entryWithTrade = entries?.find(entry => 
        entry.trades?.some((trade: Trade) => trade.id === updatedTrade.id)
      );

      if (!entryWithTrade) throw new Error('Journal entry not found');

      // Create a clean trade object for the update
      const updatedTradeObject = {
        id: updatedTrade.id,
        instrument: updatedTrade.instrument,
        direction: updatedTrade.direction,
        entryDate: updatedTrade.entryDate,
        exitDate: updatedTrade.exitDate,
        entryPrice: updatedTrade.entryPrice,
        exitPrice: updatedTrade.exitPrice,
        stopLoss: updatedTrade.stopLoss,
        takeProfit: updatedTrade.takeProfit,
        quantity: updatedTrade.quantity,
        setup: updatedTrade.setup,
        pnl: updatedTrade.pnl,
        forecastScreenshot: updatedTrade.forecastScreenshot,
        resultScreenshot: updatedTrade.resultScreenshot,
        htfBias: updatedTrade.htfBias,
        highestPrice: updatedTrade.highestPrice,
        lowestPrice: updatedTrade.lowestPrice
      };

      // Update the trades array
      const updatedTrades = entryWithTrade.trades.map((trade: Trade) => 
        trade.id === updatedTrade.id ? updatedTradeObject : trade
      );

      // Update the journal entry with the modified trades array
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: updatedTrades })
        .eq('id', entryWithTrade.id);

      if (updateError) throw updateError;

      toast.success('Trade updated successfully');
      setIsEditDialogOpen(false);
      
      // Create a full-screen loading overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center';
      overlay.innerHTML = `
        <div class="flex flex-col items-center gap-2">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p class="text-sm text-muted-foreground">Updating...</p>
        </div>
      `;
      document.body.appendChild(overlay);

      // Short delay to ensure the overlay is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating trade:', error);
      toast.error('Failed to update trade');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedTrade,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isUpdating,
    handleEditClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleTradeUpdate
  };
};
