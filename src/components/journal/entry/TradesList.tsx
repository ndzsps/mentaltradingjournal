
import { Trade } from "@/types/trade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { AddTradeDialog } from "@/components/analytics/AddTradeDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TradeActions } from "./trade-item/TradeActions";
import { TradeDetails } from "./trade-item/TradeDetails";
import { TradeHeader } from "./trade-item/TradeHeader";
import { TradeDeleteDialog } from "./trade-item/TradeDeleteDialog";
import { useAuth } from "@/contexts/AuthContext";

interface TradesListProps {
  trades: Trade[];
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const TradesList = ({ trades }: TradesListProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

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
      const { data: entries, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const entryWithTrade = entries?.find(entry => 
        entry.trades?.some((trade: Trade) => trade.id === updatedTrade.id)
      );

      if (!entryWithTrade) {
        throw new Error('Journal entry not found');
      }

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
        fees: updatedTrade.fees,
        setup: updatedTrade.setup,
        pnl: updatedTrade.pnl,
        forecastScreenshot: updatedTrade.forecastScreenshot,
        resultScreenshot: updatedTrade.resultScreenshot,
        htfBias: updatedTrade.htfBias
      };

      const updatedTrades = entryWithTrade.trades.map((trade: Trade) => 
        trade.id === updatedTrade.id ? updatedTradeObject : trade
      );

      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ trades: updatedTrades })
        .eq('id', entryWithTrade.id);

      if (updateError) throw updateError;

      toast.success('Trade updated successfully', {
        description: 'Refreshing page to show latest changes...',
      });
      
      setIsEditDialogOpen(false);
      
      // Add a delay before refresh for better UX
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error updating trade:', error);
      toast.error('Failed to update trade');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {trades.map((trade, index) => (
          <AccordionItem key={trade.id || index} value={`trade-${index}`} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-3">
              <TradeHeader trade={trade} />
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <TradeActions
                trade={trade}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
              <TradeDetails trade={trade} formatDate={formatDate} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AddTradeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleTradeUpdate}
        editTrade={selectedTrade}
      />

      <TradeDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
