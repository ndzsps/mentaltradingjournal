import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { TradeFormContent } from "./TradeFormContent";
import { Trade } from "@/types/trade";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScreenshotsTabContent } from "./ScreenshotsTabContent";

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
  const [uploading, setUploading] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Trade>>({});

  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
      setScreenshots(editTrade.screenshots || []);
      setFormData(editTrade);
    }
  }, [editTrade]);

  const handleScreenshotUpload = (url: string) => {
    setScreenshots([...screenshots, url]);
  };

  const handleFormDataChange = (data: Partial<Trade>) => {
    setFormData(data);
  };

  const handleSubmit = (tradeData: Trade, isEdit: boolean) => {
    onSubmit({ ...tradeData, screenshots }, isEdit);
  };

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
              onSubmit={handleSubmit}
              editTrade={editTrade}
              onOpenChange={onOpenChange}
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          </TabsContent>
          <TabsContent value="screenshots" className="mt-0 p-6 border-t">
            <ScreenshotsTabContent
              uploading={uploading}
              setUploading={setUploading}
              onScreenshotUpload={handleScreenshotUpload}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};