import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const JournalFilters = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 justify-start">
      <Button 
        variant="outline" 
        onClick={() => navigate('/add-journal-entry/pre-session')}
      >
        Pre-Session
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('/journal/add-trade')}
        className="gap-1"
      >
        <Plus className="h-4 w-4" /> Add Trade
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('/add-journal-entry/post-session')}
      >
        Post-Session
      </Button>
    </div>
  );
};