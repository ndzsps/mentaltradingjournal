import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { TradeFormContent } from "./TradeFormContent";
import { Trade } from "@/types/trade";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tradeData: Trade, isEdit: boolean) => void;
  editTrade?: Trade;
  children?: React.ReactNode;
}

export const TradeFormDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editTrade,
  children 
}: TradeFormDialogProps) => {
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);
  const [activeTab, setActiveTab] = useState<string>("regular");

  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
    }
  }, [editTrade]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:max-w-[1000px]">
        <div className="p-6 pb-0">
          <DialogTitle>{editTrade ? 'Edit Trade' : 'Add Trade'}</DialogTitle>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="regular">Regular Trade</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="regular" className="flex-1">
            <TradeFormContent
              direction={direction}
              setDirection={setDirection}
              onSubmit={onSubmit}
              editTrade={editTrade}
              onOpenChange={onOpenChange}
            />
          </TabsContent>
          <TabsContent value="screenshots" className="mt-0 p-6 border-t">
            <div className="text-center space-y-4">
              <div className="p-8 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors">
                <p className="text-muted-foreground">
                  Drag and drop your trade screenshots here, or click to select files
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: PNG, JPG, JPEG. Max file size: 5MB
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};