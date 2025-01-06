import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tradeData: any, isEdit: boolean) => void;
  editTrade?: any;  // Added this prop
}

export const AddTradeDialog = ({ open, onOpenChange, onSubmit, editTrade }: AddTradeDialogProps) => {
  const { user } = useAuth();
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);

  // Add effect to populate form when editing
  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
    }
  }, [editTrade]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tradeData = {
      entryDate: formData.get('entryDate') as string,
      instrument: formData.get('instrument') as string,
      setup: formData.get('setup') as string,
      direction,
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
      // Get the most recent journal entry for today
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
      const updatedTrades = [...(currentEntry.trades || []), tradeData];

      // Update the journal entry with the new trade
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: updatedTrades })
        .eq('id', currentEntry.id);

      if (updateError) throw updateError;

      onSubmit(tradeData, !!editTrade);
      onOpenChange(false);
      toast.success(editTrade ? "Trade updated successfully!" : "Trade added successfully!");
    } catch (error) {
      console.error('Error adding trade:', error);
      toast.error("Failed to add trade");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Trade</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{editTrade ? 'Edit Trade' : 'Add Trade'}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="entryDate">Entry Date</Label>
            <Input 
              type="datetime-local" 
              id="entryDate" 
              name="entryDate" 
              defaultValue={editTrade?.entryDate}
              required 
            />
          </div>
          <div>
            <Label htmlFor="instrument">Instrument</Label>
            <Input 
              type="text" 
              id="instrument" 
              name="instrument" 
              defaultValue={editTrade?.instrument}
              required 
            />
          </div>
          <div>
            <Label htmlFor="setup">Setup</Label>
            <Input 
              type="text" 
              id="setup" 
              name="setup"
              defaultValue={editTrade?.setup}
            />
          </div>
          <div>
            <Label htmlFor="direction">Direction</Label>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant={direction === 'buy' ? 'default' : 'outline'} 
                onClick={() => setDirection('buy')}
              >
                Buy
              </Button>
              <Button 
                type="button" 
                variant={direction === 'sell' ? 'default' : 'outline'} 
                onClick={() => setDirection('sell')}
              >
                Sell
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="entryPrice">Entry Price</Label>
            <Input 
              type="number" 
              id="entryPrice" 
              name="entryPrice" 
              defaultValue={editTrade?.entryPrice}
              required 
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              type="number" 
              id="quantity" 
              name="quantity" 
              defaultValue={editTrade?.quantity}
              required 
            />
          </div>
          <div>
            <Label htmlFor="stopLoss">Stop Loss</Label>
            <Input 
              type="number" 
              id="stopLoss" 
              name="stopLoss"
              defaultValue={editTrade?.stopLoss}
            />
          </div>
          <div>
            <Label htmlFor="takeProfit">Take Profit</Label>
            <Input 
              type="number" 
              id="takeProfit" 
              name="takeProfit"
              defaultValue={editTrade?.takeProfit}
            />
          </div>
          <div>
            <Label htmlFor="exitDate">Exit Date</Label>
            <Input 
              type="datetime-local" 
              id="exitDate" 
              name="exitDate"
              defaultValue={editTrade?.exitDate}
            />
          </div>
          <div>
            <Label htmlFor="exitPrice">Exit Price</Label>
            <Input 
              type="number" 
              id="exitPrice" 
              name="exitPrice"
              defaultValue={editTrade?.exitPrice}
            />
          </div>
          <div>
            <Label htmlFor="pnl">PnL</Label>
            <Input 
              type="number" 
              id="pnl" 
              name="pnl"
              defaultValue={editTrade?.pnl}
            />
          </div>
          <div>
            <Label htmlFor="fees">Fees</Label>
            <Input 
              type="number" 
              id="fees" 
              name="fees"
              defaultValue={editTrade?.fees}
            />
          </div>
          <Button type="submit">{editTrade ? 'Update' : 'Submit'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};