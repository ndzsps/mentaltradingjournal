import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePlus, Trash2, Link } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TradeScreenshotsSectionProps {
  screenshots: string[];
  setScreenshots: (screenshots: string[]) => void;
  url: string;
  setUrl: (url: string) => void;
}

export const TradeScreenshotsSection = ({
  screenshots,
  setScreenshots,
  url,
  setUrl,
}: TradeScreenshotsSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('trade-screenshots')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('trade-screenshots')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setScreenshots([...screenshots, ...uploadedUrls]);
      toast.success("Screenshots uploaded successfully");
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      toast.error("Failed to upload screenshots");
    } finally {
      setIsUploading(false);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Reference URL</Label>
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-muted-foreground" />
          <Input
            type="url"
            placeholder="Enter reference URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Trade Screenshots</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="screenshot-upload"
          />
          <Label
            htmlFor="screenshot-upload"
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Add Screenshots"}
          </Label>
        </div>
      </div>

      {screenshots.length > 0 && (
        <ScrollArea className="h-48 w-full rounded-md border">
          <div className="p-4 grid grid-cols-2 gap-4">
            {screenshots.map((screenshot, index) => (
              <div key={screenshot} className="relative group">
                <img
                  src={screenshot}
                  alt={`Trade screenshot ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeScreenshot(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};