import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Link2Icon } from "lucide-react";
import { useState } from "react";

export const TradeScreenshotsSection = () => {
  const [showForecastUrl, setShowForecastUrl] = useState(false);
  const [showResultUrl, setShowResultUrl] = useState(false);

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-background/50">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Screenshots</h3>
      </div>

      <div className="space-y-6">
        {/* Forecast Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Forecast</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                name="forecastImage"
                className="cursor-pointer file:cursor-pointer file:border-0 file:bg-primary/10 file:text-primary file:px-4 file:py-2 file:mr-4 file:rounded-md hover:file:bg-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowForecastUrl(!showForecastUrl)}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                title="Toggle URL input"
              >
                <Link2Icon className="w-4 h-4" />
              </button>
            </div>
            {showForecastUrl && (
              <Input
                type="url"
                name="forecastUrl"
                placeholder="Enter image URL"
                className="mt-2"
              />
            )}
          </div>
        </div>

        {/* Trade Result Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Trade Result</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                name="resultImage"
                className="cursor-pointer file:cursor-pointer file:border-0 file:bg-primary/10 file:text-primary file:px-4 file:py-2 file:mr-4 file:rounded-md hover:file:bg-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowResultUrl(!showResultUrl)}
                className="p-2 rounded-md hover:bg-muted transition-colors"
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
                className="mt-2"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};