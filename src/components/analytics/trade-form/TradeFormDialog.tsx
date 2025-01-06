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

      if (fetchError) throw fetchError;

      if (!entries || entries.length === 0) {
        toast.error("No journal entry found for today");
        return;
      }

      const currentEntry = entries[0];
      const existingTrades = (currentEntry.trades || []) as Trade[];
      const updatedTrades = editTrade 
        ? existingTrades.map(t => t.id === editTrade.id ? tradeData : t)
        : [...existingTrades, tradeData];

      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: updatedTrades })
        .eq('id', currentEntry.id);

      if (updateError) throw updateError;

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
      <DialogContent>
        <DialogTitle>{editTrade ? 'Edit Trade' : 'Add Trade'}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <GeneralSection direction={direction} setDirection={setDirection} />
          <TradeEntrySection />
          <TradeExitSection />
          <Button type="submit">{editTrade ? 'Update' : 'Submit'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};