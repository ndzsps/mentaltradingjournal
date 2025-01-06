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
  editTrade?: any;
}

export const AddTradeDialog = ({ open, onOpenChange, editTrade }: AddTradeDialogProps) => {
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);
  const [formProgress, setFormProgress] = useState(0);

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
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
      const categories = [
        {
          name: 'General',
          fields: ['instrument', 'entryDate'],
          directionCheck: direction !== null
        },
        {
          name: 'Entry',
          fields: ['entryPrice', 'quantity', 'stopLoss', 'takeProfit']
        },
        {
          name: 'Exit',
          fields: ['exitDate', 'exitPrice', 'pnl', 'fees']
        }
      ];

      const form = document.querySelector('form');
      if (!form) return 0;

      const formData = new FormData(form);
      let completedCategories = 0;

      categories.forEach(category => {
        const hasAllRequiredFields = category.fields.every(field => {
          const value = formData.get(field)?.toString().trim();
          // Check if the value exists and is not empty
          return value && value !== '';
        });

        // Only count category as complete if all fields are filled and direction is selected (if required)
        if (hasAllRequiredFields && (!category.directionCheck || category.directionCheck)) {
          completedCategories++;
        }
      });

      // Each category represents 33.33% of the total progress (100% / 3 categories)
      return Math.round((completedCategories / categories.length) * 100);
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

    if (formProgress < 100) {
      toast.error("Please complete all sections before submitting");
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
            All sections must be completed before submission.
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