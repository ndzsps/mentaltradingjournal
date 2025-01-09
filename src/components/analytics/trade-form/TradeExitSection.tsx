import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2Icon } from "lucide-react";
import { useState } from "react";

export const TradeExitSection = () => {
  const [showResultUrl, setShowResultUrl] = useState(false);

  const setTodayDate = (inputId: string) => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.value = localDateTime;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Trade Exit</h3>
      <div className="space-y-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="exitDate">Exit Date</Label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              id="exitDate"
              name="exitDate"
              className="w-full"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setTodayDate('exitDate')}
            >
              Today
            </Button>
          </div>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="exitPrice">Exit Price</Label>
          <Input
            type="number"
            id="exitPrice"
            name="exitPrice"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="pnl">Profit & Loss</Label>
          <Input
            type="number"
            id="pnl"
            name="pnl"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="fees">Fees</Label>
          <Input
            type="number"
            id="fees"
            name="fees"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Trade Result</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                name="resultImage"
                className="cursor-pointer file:cursor-pointer file:border-0 file:bg-primary/10 file:text-primary file:px-2 file:py-1 file:mr-2 file:rounded-md hover:file:bg-primary/20 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowResultUrl(!showResultUrl)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title="Toggle URL input"
              >
                <Link2Icon className="w-4 h-4" />
              </button>
            </div>
            {showResultUrl && (
              <Input
                type="url"
                name="resultUrl"
                placeholder="Enter image URL"
                className="text-sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};