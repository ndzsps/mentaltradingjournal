import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmotionDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  details: string[];
  onDetailSelect: (detail: string) => void;
  selectedDetail: string;
  customDetails: string[];
  onCustomDetailAdd: (detail: string) => void;
}

export const EmotionDetailDialog = ({
  isOpen,
  onOpenChange,
  details,
  onDetailSelect,
  selectedDetail,
  customDetails,
  onCustomDetailAdd,
}: EmotionDetailDialogProps) => {
  const [customDetail, setCustomDetail] = useState("");

  const handleCustomDetailSubmit = () => {
    if (customDetail.trim()) {
      onCustomDetailAdd(customDetail.trim());
      onDetailSelect(customDetail.trim());
      setCustomDetail("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>How specifically are you feeling?</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {[...details, ...customDetails].map((detail) => (
            <Button
              key={detail}
              variant="outline"
              className={`h-24 group transition-all duration-300 text-base ${
                selectedDetail === detail
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:border-primary/50 hover:bg-primary/5"
              }`}
              onClick={() => onDetailSelect(detail)}
            >
              {detail}
            </Button>
          ))}
          <div className="h-24 flex gap-2">
            <Input
              placeholder="Create your own..."
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              className="h-full text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomDetailSubmit();
                }
              }}
            />
            <Button
              variant="outline"
              className="h-full px-4"
              onClick={handleCustomDetailSubmit}
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};