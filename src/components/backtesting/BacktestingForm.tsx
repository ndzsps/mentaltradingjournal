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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create new session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="session-name">Session name*</Label>
          <Input id="session-name" placeholder="Enter session name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Enter session description" />
        </div>

        <div className="space-y-2">
          <Label>Connect to playbook</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a playbook" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="playbook1">Playbook 1</SelectItem>
              <SelectItem value="playbook2">Playbook 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <div className="flex gap-2">
            {["Forex", "Stocks", "Crypto", "Futures"].map((type) => (
              <Button
                key={type}
                variant="outline"
                className={cn(
                  "flex-1",
                  type === "Forex" && "bg-primary/10"
                )}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Symbol</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eurusd">EUR/USD</SelectItem>
              <SelectItem value="gbpusd">GBP/USD</SelectItem>
              <SelectItem value="usdjpy">USD/JPY</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-balance">Start balance*</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input id="start-balance" className="pl-6" placeholder="10000" />
            </div>
            <p className="text-sm text-muted-foreground">Leverage is 1:1</p>
          </div>

          <div className="space-y-2">
            <Label>Date range*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate && endDate ? (
                    `${format(startDate, "PP")} - ${format(endDate, "PP")}`
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: startDate,
                    to: endDate,
                  }}
                  onSelect={(range) => {
                    setStartDate(range?.from);
                    setEndDate(range?.to);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">Start time is 12 am US/Eastern</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button className="flex-1" variant="default">Create session</Button>
          <Button className="flex-1" variant="outline">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}