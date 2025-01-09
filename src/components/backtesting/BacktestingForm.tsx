import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Blueprint {
  id: string;
  name: string;
}

interface FormData {
  entryDate: string;
  entryDuration: number;
  instrument: string;
  setup: string;
  direction: 'buy' | 'sell' | null;
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  exitDate: string;
  exitDuration: number;
  exitPrice: number;
  pnl: number;
  fees: number;
  forecastScreenshot: string;
  resultScreenshot: string;
}

export function BacktestingForm() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>();
  const [direction, setDirection] = useState<'buy' | 'sell' | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    entryDate: '',
    entryDuration: 0,
    instrument: '',
    setup: '',
    direction: null,
    entryPrice: 0,
    quantity: 0,
    stopLoss: 0,
    takeProfit: 0,
    exitDate: '',
    exitDuration: 0,
    exitPrice: 0,
    pnl: 0,
    fees: 0,
    forecastScreenshot: '',
    resultScreenshot: ''
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleDirectionSelect = (selectedDirection: 'buy' | 'sell') => {
    setDirection(selectedDirection);
    setFormData(prev => ({
      ...prev,
      direction: selectedDirection
    }));
  };

  const handleSubmit = async () => {
    if (!user || !selectedBlueprint) {
      toast.error("Please select a playbook first");
      return;
    }

    if (!formData.instrument || !formData.direction || !formData.entryPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from("backtesting_sessions")
        .insert({
          user_id: user.id,
          playbook_id: selectedBlueprint,
          name: `${formData.instrument} ${formData.direction.toUpperCase()} Session`,
          market_type: "forex", // You might want to make this configurable
          symbol: formData.instrument,
          start_balance: 10000, // You might want to make this configurable
          start_date: formData.entryDate || new Date().toISOString(),
          end_date: formData.exitDate || new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Session created successfully!");
      navigate(`/blueprint/${selectedBlueprint}`);
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session");
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
                id="entryDate"
                value={formData.entryDate}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry-duration">Duration (minutes)</Label>
              <Input
                type="number"
                id="entryDuration"
                value={formData.entryDuration}
                onChange={handleInputChange}
                placeholder="Enter duration in minutes"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrument">Instrument *</Label>
              <Input
                id="instrument"
                value={formData.instrument}
                onChange={handleInputChange}
                placeholder="e.g., EUR/USD, AAPL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup">Setup</Label>
              <Input
                id="setup"
                value={formData.setup}
                onChange={handleInputChange}
                placeholder="Enter your trading setup"
              />
            </div>

            <div className="space-y-2">
              <Label>Direction *</Label>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant={direction === 'buy' ? 'default' : 'outline'}
                  onClick={() => handleDirectionSelect('buy')}
                  className={`w-full ${direction === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-500/10'}`}
                >
                  Buy
                </Button>
                <Button
                  type="button"
                  variant={direction === 'sell' ? 'default' : 'outline'}
                  onClick={() => handleDirectionSelect('sell')}
                  className={`w-full ${direction === 'sell' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-500/10'}`}
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
          <Button onClick={handleSubmit} className="flex-1">Create Session</Button>
          <Button variant="outline" className="flex-1">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}