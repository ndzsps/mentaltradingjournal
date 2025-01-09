import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FormData {
  entryDate: string;
  entryDuration: number;
  instrument: string;
  setup: string;
  direction: 'buy' | 'sell' | null;
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  exitDate: string;
  exitDuration: number;
  exitPrice: number;
  pnl: number;
  fees: number;
  forecastScreenshot: string;
  resultScreenshot: string;
}

export function useBacktestingForm(userId: string | undefined, navigate: (path: string) => void) {
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>();
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  
  const [formData, setFormData] = useState<FormData>({
    entryDate: '',
    entryDuration: 0,
    instrument: '',
    setup: '',
    direction: null,
    entryPrice: 0,
    quantity: 0,
    stopLoss: 0,
    takeProfit: 0,
    exitDate: '',
    exitDuration: 0,
    exitPrice: 0,
    pnl: 0,
    fees: 0,
    forecastScreenshot: '',
    resultScreenshot: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleDirectionSelect = (selectedDirection: 'buy' | 'sell') => {
    setDirection(selectedDirection);
    setFormData(prev => ({
      ...prev,
      direction: selectedDirection
    }));
  };

  const validateForm = () => {
    if (!selectedBlueprint) {
      setValidationError("Please select a playbook");
      return false;
    }
    if (!formData.instrument) {
      setValidationError("Please enter an instrument");
      return false;
    }
    if (!direction) {
      setValidationError("Please select a direction (buy/sell)");
      return false;
    }
    if (!formData.entryPrice) {
      setValidationError("Please enter an entry price");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!userId || !selectedBlueprint) {
      toast.error("Please select a playbook first");
      return;
    }

    try {
      const { error } = await supabase
        .from("backtesting_sessions")
        .insert({
          user_id: userId,
          playbook_id: selectedBlueprint,
          name: `${formData.instrument} ${direction?.toUpperCase()} Session`,
          market_type: "forex",
          symbol: formData.instrument,
          start_balance: 10000,
          start_date: formData.entryDate || new Date().toISOString(),
          end_date: formData.exitDate || new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Session created successfully!");
      navigate(`/blueprint/${selectedBlueprint}`);
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session");
    }
  };

  return {
    formData,
    selectedBlueprint,
    direction,
    validationError,
    setSelectedBlueprint,
    handleInputChange,
    handleDirectionSelect,
    handleSubmit
  };
}