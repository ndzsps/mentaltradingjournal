import { useState } from "react";
import { calculateUserStorageUsage } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const StorageUsage = ({ userEmail }: { userEmail: string }) => {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStorage = async () => {
    setLoading(true);
    try {
      const storageData = await calculateUserStorageUsage(userEmail);
      setUsage(storageData);
    } catch (error) {
      console.error('Error fetching storage usage:', error);
      toast.error('Failed to fetch storage usage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Storage Usage</h3>
        <Button 
          onClick={checkStorage} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? 'Calculating...' : 'Check Usage'}
        </Button>
      </div>

      {usage && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Total Storage Used: <span className="font-medium text-foreground">{usage.totalSize}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Storage Limit Used: <span className="font-medium text-foreground">{usage.percentageUsed}%</span>
          </p>
          <div className="space-y-1">
            {Object.entries(usage.buckets).map(([bucket, data]: [string, any]) => (
              <div key={bucket} className="text-sm">
                <span className="font-medium">{bucket}:</span>{' '}
                <span className="text-muted-foreground">
                  {data.count} files ({formatFileSize(data.size)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};