import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SessionHeaderProps {
  blueprintName: string;
}

export const SessionHeader = ({ blueprintName }: SessionHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center gap-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate("/backtesting")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <h1 className="text-3xl font-bold">
        {blueprintName || "Blueprint"} Sessions
      </h1>
    </div>
  );
};