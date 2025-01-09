import { Button } from "@/components/ui/button";
import { GeneralSection } from "./GeneralSection";
import { TradeEntrySection } from "./TradeEntrySection";
import { TradeExitSection } from "./TradeExitSection";
import { Trade } from "@/types/trade";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

interface TradeFormContentProps {
  direction: 'buy' | 'sell' | null;
  setDirection: (direction: 'buy' | 'sell') => void;
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  editTrade?: Trade;
  onOpenChange: (open: boolean) => void;
  formData: Partial<Trade>;
  onFormDataChange: (data: Partial<Trade>) => void;
}

export const TradeFormContent = ({ 
  direction, 
  setDirection, 
  onSubmit, 
  editTrade, 
  onOpenChange,
  formData,
  onFormDataChange
}: TradeFormContentProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (editTrade) {
      onFormDataChange(editTrade);
    }
  }, [editTrade, onFormDataChange]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    onFormDataChange({ ...formData, [name]: newValue });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <div className="flex-1 p-6 space-y-4 md:space-y-0 md:space-x-4 md:flex">
        <div className="flex-1 p-4 border rounded-lg bg-background/50">
          <GeneralSection 
            direction={direction} 
            setDirection={setDirection}
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>
        <div className="flex-1 p-4 border rounded-lg bg-background/50">
          <TradeEntrySection
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>
        <div className="flex-1 p-4 border rounded-lg bg-background/50">
          <TradeExitSection
            formData={formData}
            onInputChange={handleInputChange}
          />
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