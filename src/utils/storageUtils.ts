import { supabase } from "@/integrations/supabase/client";

export const calculateUserStorageUsage = async (userEmail: string) => {
  try {
    // First get the user's ID from their email
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (profileError) throw profileError;
    if (!profileData) throw new Error('User not found');

    const userId = profileData.id;

    // Get files from both buckets
    const buckets = ['avatars', 'trade-screenshots'];
    let totalSize = 0;
    const filesByBucket: Record<string, { count: number; size: number }> = {};

    for (const bucket of buckets) {
      const { data: files, error } = await supabase
        .storage
        .from(bucket)
        .list(userId);

      if (error) throw error;

      if (files) {
        const bucketSize = files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
        totalSize += bucketSize;
        filesByBucket[bucket] = {
          count: files.length,
          size: bucketSize
        };
      }
    }

    return {
      totalSize: formatFileSize(totalSize),
      totalBytes: totalSize,
      buckets: filesByBucket,
      percentageUsed: ((totalSize / (1024 * 1024 * 1024)) * 100).toFixed(2) // Percentage of 1GB
    };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    throw error;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};