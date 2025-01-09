import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function BacktestingForm() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const setTodayDate = (setter: (date: Date) => void) => {
    setter(new Date());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create new session</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* General Section */}
          <div className="space-y-4 p-6 bg-background/50 border rounded-lg">
            <h3 className="text-lg font-semibold">General</h3>
            
            <div className="space-y-2">
              <Label htmlFor="entry-date">Entry Date</Label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  id="entry-date"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTodayDate(setStartDate)}
                >
                  Today
                </Button>
              </div>
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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 hover:bg-green-500/10"
                >
                  Buy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 hover:bg-red-500/10"
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
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  id="exit-date"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTodayDate(setEndDate)}
                >
                  Today
                </Button>
              </div>
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