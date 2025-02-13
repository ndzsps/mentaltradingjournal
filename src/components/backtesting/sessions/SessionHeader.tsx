
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface SessionHeaderProps {
  blueprintName: string;
  description?: string;
  blueprintId?: string;
}

export const SessionHeader = ({ blueprintName, description, blueprintId }: SessionHeaderProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [isSaving, setIsSaving] = useState(false);

  // Update editedDescription when description prop changes
  useEffect(() => {
    setEditedDescription(description || "");
  }, [description]);

  const handleSave = async () => {
    if (!blueprintId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("trading_blueprints")
        .update({ description: editedDescription })
        .eq("id", blueprintId);

      if (error) throw error;

      toast.success("Strategy description updated successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update strategy description");
    } finally {
      setIsSaving(false);
    }
  };

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
      
      <div className="flex items-center gap-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Strategy Description</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Strategy Description</DialogTitle>
              <DialogDescription className="pt-4">
                Edit your strategy description below. This helps you maintain clear documentation of your trading approach.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Describe your trading strategy..."
                className="min-h-[200px]"
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedDescription(description || "");
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          variant="default"
          onClick={() => navigate("/backtesting")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Session
        </Button>
      </div>
    </div>
  );
};
