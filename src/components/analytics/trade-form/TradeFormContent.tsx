import { Button } from "@/components/ui/button";
import { GeneralSection } from "./GeneralSection";
import { TradeEntrySection } from "./TradeEntrySection";
import { TradeExitSection } from "./TradeExitSection";
import { TradeScreenshotsSection } from "./TradeScreenshotsSection";
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
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-background/50">
            <GeneralSection direction={direction} setDirection={setDirection} />
          </div>
          <div className="p-4 border rounded-lg bg-background/50">
            <TradeEntrySection />
          </div>
          <div className="p-4 border rounded-lg bg-background/50">
            <TradeExitSection />
          </div>
        </div>
        <div className="p-4 border rounded-lg bg-background/50">
          <TradeScreenshotsSection />
        </div>
      </div>
      <div className="p-6 pt-4 border-t mt-4">
        <Button type="submit" className="w-full">
          {editTrade ? 'Update' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};