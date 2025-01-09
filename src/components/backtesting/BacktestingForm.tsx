import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GeneralSection } from "./form-sections/GeneralSection";
import { TradeEntrySection } from "./form-sections/TradeEntrySection";
import { TradeExitSection } from "./form-sections/TradeExitSection";
import { useBacktestingForm } from "@/hooks/useBacktestingForm";

interface Blueprint {
  id: string;
  name: string;
}

export function BacktestingForm() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    formData,
    selectedBlueprint,
    direction,
    validationError,
    setSelectedBlueprint,
    handleInputChange,
    handleDirectionSelect,
    handleSubmit
  } = useBacktestingForm(user?.id, navigate);

  useEffect(() => {
    if (user) {
      fetchBlueprints();
    }
  }, [user]);

  const fetchBlueprints = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("trading_blueprints")
      .select("id, name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBlueprints(data);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create new session</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="playbook">Select Playbook *</Label>
          <Select value={selectedBlueprint} onValueChange={setSelectedBlueprint}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Choose a playbook" />
            </SelectTrigger>
            <SelectContent>
              {blueprints.map((blueprint) => (
                <SelectItem key={blueprint.id} value={blueprint.id}>
                  {blueprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {validationError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GeneralSection
            formData={formData}
            direction={direction}
            onInputChange={handleInputChange}
            onDirectionSelect={handleDirectionSelect}
          />
          <TradeEntrySection
            formData={formData}
            onInputChange={handleInputChange}
          />
          <TradeExitSection
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleSubmit} className="flex-1">Create Session</Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/backtesting')}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}