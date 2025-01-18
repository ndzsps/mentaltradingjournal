import { StorageUsage } from "@/components/storage/StorageUsage";

export const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <StorageUsage userEmail="edwardhong.bk@gmail.com" />
    </div>
  );
};