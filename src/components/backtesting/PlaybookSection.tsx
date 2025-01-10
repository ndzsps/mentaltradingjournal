import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddBlueprintForm } from "./AddBlueprintForm";
import { BlueprintCard } from "./BlueprintCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function PlaybookSection() {
  const [open, setOpen] = useState(false);
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBlueprints();
    }
  }, [user]);

  const fetchBlueprints = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("trading_blueprints")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBlueprints(data);
    }
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-lg animate-fade-in border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Playbook
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-primary/10 transition-colors border-primary/20"
            >
              <Plus className="h-4 w-4" />
              Add Blueprint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Trading Blueprint</DialogTitle>
            </DialogHeader>
            <AddBlueprintForm onSuccess={() => {
              setOpen(false);
              fetchBlueprints();
            }} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {blueprints.length === 0 ? (
          <p className="text-primary/80 text-center py-8 animate-fade-in font-medium">
            Select or create a playbook to view trading rules and strategies for your backtesting session.
          </p>
        ) : (
          <div className="grid gap-4 animate-fade-in">
            {blueprints.map((blueprint) => (
              <BlueprintCard
                key={blueprint.id}
                id={blueprint.id}
                name={blueprint.name}
                instrument={blueprint.rules[0]?.replace("Instrument: ", "") || "N/A"}
                emoji={blueprint.emoji}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}