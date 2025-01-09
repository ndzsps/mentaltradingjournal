import { Card } from "@/components/ui/card";

export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-rows-5 h-[calc(100vh-20rem)] pt-[150px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center px-2 mb-8">
          <Card className="p-4 space-y-2 bg-primary/5 w-full h-[4.5rem]">
            <div className="h-4 bg-primary/10 rounded w-1/3"></div>
            <div className="h-6 bg-primary/10 rounded w-2/3"></div>
          </Card>
        </div>
      ))}
    </div>
  );
};