import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Blueprint {
  id: string;
  name: string;
}

export function BacktestingForm() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>();
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
          <Label htmlFor="playbook">Select Playbook</Label>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* General Section */}
          <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
            <h3 className="text-lg font-semibold">General</h3>
            
            <div className="space-y-2">
              <Label htmlFor="entry-date">Entry Date</Label>
              <Input
                type="date"
                id="entry-date"
                className="flex-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry-duration">Duration (minutes)</Label>
              <Input
                type="number"
                id="entry-duration"
                placeholder="Enter duration in minutes"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrument">Instrument *</Label>
              <Input
                id="instrument"
                placeholder="e.g., EUR/USD, AAPL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup">Setup</Label>
              <Input
                id="setup"
                placeholder="Enter your trading setup"
              />
            </div>

            <div className="space-y-2">
              <Label>Direction *</Label>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full hover:bg-green-500/10"
                >
                  Buy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full hover:bg-red-500/10"
                >
                  Sell
                </Button>
              </div>
            </div>
          </div>

          {/* Trade Entry Section */}
          <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
            <h3 className="text-lg font-semibold">Trade Entry</h3>
            
            <div className="space-y-2">
              <Label htmlFor="entry-price">Entry Price *</Label>
              <Input
                type="number"
                id="entry-price"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                placeholder="Enter lot size or contracts"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop-loss">Stop Loss</Label>
              <Input
                type="number"
                id="stop-loss"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="take-profit">Take Profit</Label>
              <Input
                type="number"
                id="take-profit"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="forecast-screenshot">Forecast Screenshot URL</Label>
              <Input
                type="url"
                id="forecast-screenshot"
                placeholder="Enter screenshot URL"
              />
            </div>
          </div>

          {/* Trade Exit Section */}
          <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
            <h3 className="text-lg font-semibold">Trade Exit</h3>
            
            <div className="space-y-2">
              <Label htmlFor="exit-date">Exit Date</Label>
              <Input
                type="datetime-local"
                id="exit-date"
                className="flex-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exit-duration">Duration (minutes)</Label>
              <Input
                type="number"
                id="exit-duration"
                placeholder="Enter duration in minutes"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exit-price">Exit Price</Label>
              <Input
                type="number"
                id="exit-price"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pnl">Profit & Loss</Label>
              <Input
                type="number"
                id="pnl"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees</Label>
              <Input
                type="number"
                id="fees"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="result-screenshot">Result Screenshot URL</Label>
              <Input
                type="url"
                id="result-screenshot"
                placeholder="Enter screenshot URL"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button className="flex-1">Create Session</Button>
          <Button variant="outline" className="flex-1">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}