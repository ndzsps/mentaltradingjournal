import { Button } from "@/components/ui/button";
import { GeneralSection } from "./GeneralSection";
import { TradeEntrySection } from "./TradeEntrySection";
import { TradeExitSection } from "./TradeExitSection";
import { Trade } from "@/types/trade";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TradeFormContentProps {
  direction: 'buy' | 'sell' | null;
  setDirection: (direction: 'buy' | 'sell') => void;
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  editTrade?: Trade;
  onOpenChange: (open: boolean) => void;
}

export const TradeFormContent = ({ 
  direction, 
  setDirection, 
  onSubmit, 
  editTrade, 
  onOpenChange 
}: TradeFormContentProps) => {
  const { user } = useAuth();

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
      
      // First, get all entries for today
      const { data: entries, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Find the most recent post-session entry
      const postSessionEntry = entries?.find(entry => entry.session_type === 'post');
      
      if (!postSessionEntry) {
        toast.error("Please create a post-session entry before adding trades", {
          description: "Go back to the journal form and create a post-session entry first.",
          duration: 5000,
        });
        onOpenChange(false);
        return;
      }

      // Get existing trades for this session
      const existingTrades = (postSessionEntry.trades || []).map((trade: any) => ({
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

      // Update trades array
      const updatedTrades = editTrade 
        ? existingTrades.map(t => t.id === editTrade.id ? tradeData : t)
        : [...existingTrades, tradeData];

      // Format trades for database
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

      // Update the journal entry with the new trades
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: tradesForDb })
        .eq('id', postSessionEntry.id);

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
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <div className="flex-1 p-6 space-y-4 md:space-y-0 md:space-x-4 md:flex">
        <div className="flex-1 p-4 border rounded-lg bg-background/50">
          <GeneralSection direction={direction} setDirection={setDirection} />
        </div>
        <div className="flex-1 p-4 border rounded-lg bg-background/50">
          <TradeEntrySection />
        </div>
        <div className="flex-1 p-4 border rounded-lg bg-background/50">
          <TradeExitSection />
        </div>
      </div>
      <div className="p-6 pt-0 border-t">
        <Button type="submit" className="w-full">
          {editTrade ? 'Update' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};