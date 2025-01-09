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
  const [validationError, setValidationError] = useState<string>("");
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

  const validateForm = () => {
    if (!selectedBlueprint) {
      setValidationError("Please select a playbook");
      return false;
    }
    if (!formData.instrument) {
      setValidationError("Please enter an instrument");
      return false;
    }
    if (!direction) {
      setValidationError("Please select a direction (buy/sell)");
      return false;
    }
    if (!formData.entryPrice) {
      setValidationError("Please enter an entry price");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user || !selectedBlueprint) {
      toast.error("Please select a playbook first");
      return;
    }

    try {
      const { error } = await supabase
        .from("backtesting_sessions")
        .insert({
          user_id: user.id,
          playbook_id: selectedBlueprint,
          name: `${formData.instrument} ${direction?.toUpperCase()} Session`,
          market_type: "forex",
          symbol: formData.instrument,
          start_balance: 10000,
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
          {/* General Section */}
          <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
            <h3 className="text-lg font-semibold">General</h3>
            
            <div className="space-y-2">
              <Label htmlFor="entryDate">Entry Date</Label>
              <Input
                type="date"
                id="entryDate"
                value={formData.entryDate}
                onChange={handleInputChange}
                className="flex-1"
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
              <Label htmlFor="entryPrice">Entry Price *</Label>
              <Input
                type="number"
                id="entryPrice"
                value={formData.entryPrice || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                value={formData.quantity || ''}
                onChange={handleInputChange}
                placeholder="Enter lot size or contracts"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                type="number"
                id="stopLoss"
                value={formData.stopLoss || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit</Label>
              <Input
                type="number"
                id="takeProfit"
                value={formData.takeProfit || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          {/* Trade Exit Section */}
          <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
            <h3 className="text-lg font-semibold">Trade Exit</h3>
            
            <div className="space-y-2">
              <Label htmlFor="exitDate">Exit Date</Label>
              <Input
                type="date"
                id="exitDate"
                value={formData.exitDate}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price</Label>
              <Input
                type="number"
                id="exitPrice"
                value={formData.exitPrice || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pnl">Profit & Loss</Label>
              <Input
                type="number"
                id="pnl"
                value={formData.pnl || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees</Label>
              <Input
                type="number"
                id="fees"
                value={formData.fees || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleSubmit} className="flex-1">Create Session</Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/backtesting')}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}