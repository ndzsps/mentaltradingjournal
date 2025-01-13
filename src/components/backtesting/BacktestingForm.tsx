import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GeneralSection } from "./form-sections/GeneralSection";
import { TradeEntrySection } from "./form-sections/TradeEntrySection";
import { TradeExitSection } from "./form-sections/TradeExitSection";
import { PlaybookSelector } from "./form-sections/PlaybookSelector";
import { ScreenshotLinksSection } from "./form-sections/ScreenshotLinksSection";
import { useBacktestingForm } from "@/hooks/useBacktestingForm";

interface Blueprint {
  id: string;
  name: string;
}

export const BacktestingForm = forwardRef((_, ref) => {
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

  useImperativeHandle(ref, () => ({
    fetchBlueprints
  }));

  useEffect(() => {
    if (user) {
      fetchBlueprints();
    }
  }, [user]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create new session</CardTitle>
      </CardHeader>
      <CardContent>
        <PlaybookSelector 
          blueprints={blueprints}
          selectedBlueprint={selectedBlueprint}
          onBlueprintSelect={setSelectedBlueprint}
        />

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

        <ScreenshotLinksSection 
          formData={formData}
          onInputChange={handleInputChange}
        />

        <div className="flex gap-4 mt-6">
          <Button onClick={handleSubmit} className="flex-1">Create Session</Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/backtesting')}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
});

BacktestingForm.displayName = "BacktestingForm";