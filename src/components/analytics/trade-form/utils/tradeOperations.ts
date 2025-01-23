import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types/trade";

export const findTradeEntry = async (tradeId: string) => {
  const { data: entries, error: fetchError } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('session_type', 'trade');

  if (fetchError) throw fetchError;
  
  const entry = entries?.find(entry => {
    const trades = entry.trades as any[];
    return trades?.some(trade => trade.id === tradeId);
  });

  if (!entry) throw new Error('Journal entry not found');
  return entry;
};

export const createTradeObject = (formData: FormData): Trade => ({
  entryDate: formData.get("entryDate") as string,
  instrument: formData.get("instrument") as string,
  setup: formData.get("setup") as string,
  direction: formData.get("direction") as string,
  entryPrice: parseFloat(formData.get("entryPrice") as string),
  exitPrice: parseFloat(formData.get("exitPrice") as string),
  quantity: parseFloat(formData.get("quantity") as string),
  stopLoss: parseFloat(formData.get("stopLoss") as string),
  takeProfit: parseFloat(formData.get("takeProfit") as string),
  pnl: parseFloat(formData.get("pnl") as string),
  fees: parseFloat(formData.get("fees") as string),
  exitDate: formData.get("exitDate") as string,
  forecastScreenshot: formData.get("forecastScreenshot") as string,
  resultUrl: formData.get("resultUrl") as string,
});

export const updateExistingTrade = async (entry: any, editTrade: Trade, tradeData: Trade) => {
  const trades = entry.trades as any[];
  const updatedTradeObject = {
    id: editTrade.id,
    ...tradeData
  };

  const updatedTrades = trades.map(trade => 
    trade.id === editTrade.id ? updatedTradeObject : trade
  );

  const { error: updateError } = await supabase
    .from('journal_entries')
    .update({ trades: updatedTrades })
    .eq('id', entry.id);

  if (updateError) throw updateError;
};

export const createNewTrade = async (tradeData: Trade, userId: string) => {
  const tradeObject = {
    id: crypto.randomUUID(),
    ...tradeData
  };

  const { error: tradeError } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      notes: `Trade entry for ${tradeData.instrument}`,
      trades: [tradeObject],
      session_type: 'trade',
      emotion: 'neutral',    
      emotion_detail: 'neutral'
    });

  if (tradeError) throw tradeError;
  return tradeObject;
};