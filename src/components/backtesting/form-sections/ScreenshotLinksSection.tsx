import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ScreenshotLinksSectionProps {
  formData: {
    weeklyUrl: string;
    dailyUrl: string;
    fourHourUrl: string;
    oneHourUrl: string;
    refinedEntryUrl: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ScreenshotLinksSection({ formData, onInputChange }: ScreenshotLinksSectionProps) {
  return (
    <div className="mt-6 p-4 border rounded-lg bg-background/50">
      <h3 className="text-lg font-semibold mb-4">Screenshot Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="weeklyUrl">Weekly</Label>
            <Input
              type="url"
              id="weeklyUrl"
              name="weeklyUrl"
              placeholder="Enter weekly chart link"
              onChange={onInputChange}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fourHourUrl">4 HR</Label>
            <Input
              type="url"
              id="fourHourUrl"
              name="fourHourUrl"
              placeholder="Enter 4 hour chart link"
              onChange={onInputChange}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="refinedEntryUrl">Refined Entry</Label>
            <Input
              type="url"
              id="refinedEntryUrl"
              name="refinedEntryUrl"
              placeholder="Enter refined entry link"
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="dailyUrl">Daily</Label>
            <Input
              type="url"
              id="dailyUrl"
              name="dailyUrl"
              placeholder="Enter daily chart link"
              onChange={onInputChange}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="oneHourUrl">1 HR</Label>
            <Input
              type="url"
              id="oneHourUrl"
              name="oneHourUrl"
              placeholder="Enter 1 hour chart link"
              onChange={onInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}