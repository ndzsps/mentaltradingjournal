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

  const createJournalEntry = async (tradeData: Trade) => {
    if (!user) return;

    // Convert trade data to a plain object to ensure it matches the expected JSON type
    const tradeObject = {
      id: tradeData.id,
      instrument: tradeData.instrument,
      direction: tradeData.direction,
      entryDate: tradeData.entryDate,
      exitDate: tradeData.exitDate,
      entryPrice: tradeData.entryPrice,
      exitPrice: tradeData.exitPrice,
      stopLoss: tradeData.stopLoss,
      takeProfit: tradeData.takeProfit,
      quantity: tradeData.quantity,
      fees: tradeData.fees,
      setup: tradeData.setup,
      pnl: tradeData.pnl,
      forecastScreenshot: tradeData.forecastScreenshot,
      resultScreenshot: tradeData.resultScreenshot,
      htfBias: tradeData.htfBias
    };

    try {
      const { error: journalError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          session_type: 'trade',
          emotion: 'neutral',
          emotion_detail: 'neutral',
          notes: `Trade entry for ${tradeData.instrument || 'Unknown Instrument'}`,
          trades: [tradeObject],
          created_at: tradeData.entryDate || new Date().toISOString()
        });

      if (journalError) {
        console.error('Journal entry error:', journalError);
        throw journalError;
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Only include fields that have values
    const tradeData: Trade = {
      id: editTrade?.id || crypto.randomUUID(),
      direction: direction as 'buy' | 'sell',
    };

    // Only add fields that have values
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
      if (!editTrade) {
        // Only create journal entry for new trades, not edits
        await createJournalEntry(tradeData);
      }
      
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