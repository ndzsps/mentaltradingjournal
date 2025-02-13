
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SessionHeaderProps {
  blueprintName: string;
  description?: string;
}

export const SessionHeader = ({ blueprintName, description }: SessionHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
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
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Strategy Description</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Strategy Description</DialogTitle>
            <DialogDescription className="mt-4 whitespace-pre-wrap">
              {description || "No description available"}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
