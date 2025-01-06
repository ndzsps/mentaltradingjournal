import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GeneralSection } from "./GeneralSection";
import { TradeEntrySection } from "./TradeEntrySection";
import { TradeExitSection } from "./TradeExitSection";
import { Trade } from "@/types/trade";

interface TradeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  editTrade?: Trade;
}

export const TradeFormDialog = ({ open, onOpenChange, onSubmit, editTrade }: TradeFormDialogProps) => {
  const { user } = useAuth();
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);

  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
    }
  }, [editTrade]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tradeData: Trade = {
      id: editTrade?.id || crypto.randomUUID(),
      entryDate: formData.get('entryDate') as string,
      instrument: formData.get('instrument') as string,
      setup: formData.get('setup') as string,
      direction: direction as 'buy' | 'sell',
      entryPrice: parseFloat(formData.get('entryPrice') as string),
      quantity: parseFloat(formData.get('quantity') as string),
      stopLoss: parseFloat(formData.get('stopLoss') as string),
      takeProfit: parseFloat(formData.get('takeProfit') as string),
      exitDate: formData.get('exitDate') as string,
      exitPrice: parseFloat(formData.get('exitPrice') as string),
      pnl: parseFloat(formData.get('pnl') as string),
      fees: parseFloat(formData.get('fees') as string),
    };

    console.log('Trade form submitted with data:', tradeData);

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: entries, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('Fetched journal entries:', entries);

      if (fetchError) throw fetchError;

      if (!entries || entries.length === 0) {
        toast.error("No journal entry found for today");
        return;
      }

      const currentEntry = entries[0];
      console.log('Current entry before update:', currentEntry);
      
      // Cast the trades array to Trade[] after parsing from JSON
      const existingTrades = (currentEntry.trades || []).map((trade: any) => ({
        id: trade.id || crypto.randomUUID(),
        entryDate: trade.entryDate,
        instrument: trade.instrument,
        setup: trade.setup,
        direction: trade.direction,
        entryPrice: parseFloat(trade.entryPrice),
        quantity: parseFloat(trade.quantity),
        stopLoss: parseFloat(trade.stopLoss),
        takeProfit: parseFloat(trade.takeProfit),
        exitDate: trade.exitDate,
        exitPrice: parseFloat(trade.exitPrice),
        pnl: parseFloat(trade.pnl),
        fees: parseFloat(trade.fees),
      })) as Trade[];

      console.log('Existing trades:', existingTrades);

      const updatedTrades = editTrade 
        ? existingTrades.map(t => t.id === editTrade.id ? tradeData : t)
        : [...existingTrades, tradeData];

      console.log('Updated trades array:', updatedTrades);

      // Convert Trade[] to Json[] before sending to Supabase
      const tradesForDb = updatedTrades.map(trade => ({
        ...trade,
        entryPrice: trade.entryPrice.toString(),
        quantity: trade.quantity.toString(),
        stopLoss: trade.stopLoss.toString(),
        takeProfit: trade.takeProfit.toString(),
        exitPrice: trade.exitPrice.toString(),
        pnl: trade.pnl.toString(),
        fees: trade.fees.toString(),
      }));

      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: tradesForDb })
        .eq('id', currentEntry.id);

      if (updateError) {
        console.error('Error updating trades:', updateError);
        throw updateError;
      }

      console.log('Successfully updated trades in database');
      onSubmit(tradeData, !!editTrade);
      onOpenChange(false);
      toast.success(editTrade ? "Trade updated successfully!" : "Trade added successfully!");
    } catch (error) {
      console.error('Error managing trade:', error);
      toast.error("Failed to manage trade");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-0">
          <DialogTitle>{editTrade ? 'Edit Trade' : 'Add Trade'}</DialogTitle>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <GeneralSection direction={direction} setDirection={setDirection} />
            <TradeEntrySection />
            <TradeExitSection />
          </div>
          <div className="p-6 pt-0 border-t">
            <Button type="submit" className="w-full">
              {editTrade ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};