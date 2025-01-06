import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GeneralSection } from "./trade-form/GeneralSection";
import { TradeEntrySection } from "./trade-form/TradeEntrySection";
import { TradeExitSection } from "./trade-form/TradeExitSection";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTrade?: any; // Type this properly based on your trade data structure
}

export const AddTradeDialog = ({ open, onOpenChange, editTrade }: AddTradeDialogProps) => {
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);
  const [formProgress, setFormProgress] = useState(0);

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
      // Populate form fields
      const fields = ['entryDate', 'instrument', 'setup', 'entryPrice', 'quantity', 'stopLoss', 'takeProfit', 'exitDate', 'exitPrice', 'pnl', 'fees'];
      fields.forEach(field => {
        const input = document.getElementById(field) as HTMLInputElement;
        if (input && editTrade[field]) {
          input.value = editTrade[field];
        }
      });
    }
  }, [editTrade]);

  // Calculate form progress
  useEffect(() => {
    const calculateProgress = () => {
      const requiredFields = [
        'instrument',
        'entryPrice',
        direction,
      ];

      const optionalFields = [
        'entryDate',
        'setup',
        'quantity',
        'stopLoss',
        'takeProfit',
        'exitDate',
        'exitPrice',
        'pnl',
        'fees',
      ];

      const form = document.querySelector('form');
      if (!form) return 0;

      const formData = new FormData(form);
      const filledRequiredFields = requiredFields.filter(field => {
        if (typeof field === 'string') {
          return formData.get(field);
        }
        return field !== null;
      });

      const filledOptionalFields = optionalFields.filter(field => formData.get(field));

      // Required fields contribute to 60% of progress, optional fields to 40%
      const requiredProgress = (filledRequiredFields.length / requiredFields.length) * 60;
      const optionalProgress = (filledOptionalFields.length / optionalFields.length) * 40;

      return Math.round(requiredProgress + optionalProgress);
    };

    const progressInterval = setInterval(() => {
      setFormProgress(calculateProgress());
    }, 500);

    return () => clearInterval(progressInterval);
  }, [direction]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const tradeData = {
      entryDate: formData.get('entryDate'),
      instrument: formData.get('instrument'),
      setup: formData.get('setup'),
      direction: direction,
      entryPrice: formData.get('entryPrice'),
      quantity: formData.get('quantity'),
      stopLoss: formData.get('stopLoss'),
      takeProfit: formData.get('takeProfit'),
      exitDate: formData.get('exitDate'),
      exitPrice: formData.get('exitPrice'),
      pnl: formData.get('pnl'),
      fees: formData.get('fees'),
    };

    if (!tradeData.instrument || !tradeData.direction || !tradeData.entryPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Trade submitted:", tradeData);
    toast.success(editTrade ? "Trade updated successfully!" : "Trade added successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{editTrade ? 'Edit Trade' : 'Add New Trade'}</DialogTitle>
          <DialogDescription>
            Fill in the details of your trade. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Form Progress</span>
            <span>{formProgress}%</span>
          </div>
          <Progress value={formProgress} className="h-2" />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
          <GeneralSection direction={direction} setDirection={setDirection} />
          <TradeEntrySection />
          <TradeExitSection />
          
          <div className="col-span-3">
            <Button type="submit" className="w-full">
              {editTrade ? 'Update Trade' : 'Add Trade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};