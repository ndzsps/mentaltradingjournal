import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { TradeFormContent } from "./TradeFormContent";
import { Trade } from "@/types/trade";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Link2Icon } from "lucide-react";

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
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTrade) {
      setDirection(editTrade.direction);
    }
  }, [editTrade]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log("Selected files:", files);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log("Dropped files:", files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      // Handle URL submission logic here
      console.log("Submitted URL:", imageUrl);
      setImageUrl("");
      setShowUrlInput(false);
    }
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
              onSubmit={onSubmit}
              editTrade={editTrade}
              onOpenChange={onOpenChange}
            />
          </TabsContent>
          <TabsContent value="screenshots" className="mt-0 p-6 border-t">
            <div className="text-center space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                multiple
              />
              <div 
                className="p-8 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Drag and drop your trade screenshots here, or click to select files
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  <Link2Icon className="mr-2 h-4 w-4" />
                  Paste Image URL
                </Button>
                {showUrlInput && (
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Enter image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleUrlSubmit}>Add</Button>
                  </div>
                )}
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