import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trade } from "@/types/trade";
import { TradeFormDialog } from "@/components/analytics/trade-form/TradeFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface TradesListProps {
  trades?: Trade[];
  onTradesUpdate?: () => void;
}

export const TradesList = ({ trades = [], onTradesUpdate }: TradesListProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const queryClient = useQueryClient();

  const handleTradeUpdate = async (updatedTrade: Trade) => {
    try {
      // Get all journal entries for the day of the trade
      const entryDate = new Date(updatedTrade.entryDate || new Date());
      const startOfDay = new Date(entryDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(entryDate.setHours(23, 59, 59, 999));

      const { data: entries, error: fetchError } = await supabase
        .from('journal_entries')
        .select()
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

      if (fetchError) throw fetchError;
      if (!entries || entries.length === 0) {
        throw new Error('Journal entry not found');
      }

      // Find the entry containing this trade
      const entry = entries.find(e => 
        e.trades?.some((t: any) => t.id === updatedTrade.id)
      );

      if (!entry) {
        throw new Error('Trade not found in journal entries');
      }

      const currentTrades = entry.trades || [];
      
      // Prepare the updated trade object
      const updatedTradeObject = {
        id: updatedTrade.id,
        direction: updatedTrade.direction,
        entryDate: updatedTrade.entryDate,
        instrument: updatedTrade.instrument,
        setup: updatedTrade.setup,
        entryPrice: updatedTrade.entryPrice,
        exitDate: updatedTrade.exitDate,
        exitPrice: updatedTrade.exitPrice,
        quantity: updatedTrade.quantity,
        stopLoss: updatedTrade.stopLoss,
        takeProfit: updatedTrade.takeProfit,
        pnl: updatedTrade.pnl,
        fees: updatedTrade.fees,
        forecastScreenshot: updatedTrade.forecastScreenshot,
        resultScreenshot: updatedTrade.resultScreenshot,
        htfBias: updatedTrade.htfBias
      };

      // Update the trades array
      const updatedTrades = currentTrades.map((trade: any) => 
        trade.id === updatedTrade.id ? updatedTradeObject : trade
      );

      // Update the journal entry with the new trades array
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: updatedTrades })
        .eq('id', entry.id);

      if (updateError) throw updateError;

      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: ['analytics'] });
      await queryClient.invalidateQueries({ queryKey: ['weekly-performance'] });
      
      // Close dialog and notify success
      setIsEditDialogOpen(false);
      toast.success('Trade updated successfully');
      
      // Call the onTradesUpdate callback if provided
      if (onTradesUpdate) {
        onTradesUpdate();
      }
    } catch (error) {
      console.error('Error updating trade:', error);
      toast.error('Failed to update trade');
    }
  };

  if (!trades || trades.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-sm">No trades recorded</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trades.map((trade) => (
        <Card key={trade.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {trade.instrument || 'Unknown Instrument'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {trade.setup || 'No setup specified'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTrade(trade);
                setIsEditDialogOpen(true);
              }}
            >
              Edit
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Direction</p>
              <p>{trade.direction}</p>
            </div>
            <div>
              <p className="text-muted-foreground">P&L</p>
              <p className={trade.pnl && trade.pnl > 0 ? 'text-green-500' : 'text-red-500'}>
                ${trade.pnl?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </Card>
      ))}

      <TradeFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleTradeUpdate}
        editTrade={selectedTrade || undefined}
      />
    </div>
  );
};