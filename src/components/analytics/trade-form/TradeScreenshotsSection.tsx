import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const TradeScreenshotsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Upload className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Screenshots</h3>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <Label 
            htmlFor="forecastScreenshot" 
            className="text-sm font-medium text-muted-foreground"
          >
            Forecast Screenshot
          </Label>
          <div className="relative">
            <Input
              type="file"
              id="forecastScreenshot"
              name="forecastScreenshot"
              accept="image/*"
              className="cursor-pointer bg-background/50 hover:bg-background/80 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label 
            htmlFor="beforeTradeScreenshot"
            className="text-sm font-medium text-muted-foreground"
          >
            Before Trade Screenshot
          </Label>
          <div className="relative">
            <Input
              type="file"
              id="beforeTradeScreenshot"
              name="beforeTradeScreenshot"
              accept="image/*"
              className="cursor-pointer bg-background/50 hover:bg-background/80 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label 
            htmlFor="afterTradeScreenshot"
            className="text-sm font-medium text-muted-foreground"
          >
            After Trade Screenshot
          </Label>
          <div className="relative">
            <Input
              type="file"
              id="afterTradeScreenshot"
              name="afterTradeScreenshot"
              accept="image/*"
              className="cursor-pointer bg-background/50 hover:bg-background/80 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};