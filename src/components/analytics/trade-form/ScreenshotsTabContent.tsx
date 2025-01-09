import { ImageIcon, Link2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScreenshotsTabContentProps {
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  onScreenshotUpload: (url: string) => void;
}

export const ScreenshotsTabContent = ({
  uploading,
  setUploading,
  onScreenshotUpload,
}: ScreenshotsTabContentProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('trade-screenshots')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('trade-screenshots')
        .getPublicUrl(filePath);

      toast.success('Screenshot uploaded successfully!');
      onScreenshotUpload(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload screenshot');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      await uploadFile(file);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      await uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) return;

    try {
      setUploading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      await uploadFile(file);
      setImageUrl("");
      setShowUrlInput(false);
    } catch (error) {
      console.error('Error uploading image from URL:', error);
      toast.error('Failed to upload image from URL');
    } finally {
      setUploading(false);
    }
  };

  return (
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
        className={`p-8 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            {uploading ? 'Uploading...' : 'Drag and drop your trade screenshots here, or click to select files'}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={uploading}
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
              disabled={uploading}
            />
            <Button 
              onClick={handleUrlSubmit}
              disabled={!imageUrl || uploading}
            >
              Add
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Supported formats: PNG, JPG, JPEG. Max file size: 5MB
      </p>
    </div>
  );
};