import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const TradeScreenshotsSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Screenshots</h3>
      <div className="space-y-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="forecastScreenshot">Forecast</Label>
          <Input
            type="file"
            id="forecastScreenshot"
            name="forecastScreenshot"
            accept="image/*"
            className="cursor-pointer"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="beforeTradeScreenshot">Before Trade</Label>
          <Input
            type="file"
            id="beforeTradeScreenshot"
            name="beforeTradeScreenshot"
            accept="image/*"
            className="cursor-pointer"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="afterTradeScreenshot">After Trade</Label>
          <Input
            type="file"
            id="afterTradeScreenshot"
            name="afterTradeScreenshot"
            accept="image/*"
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};