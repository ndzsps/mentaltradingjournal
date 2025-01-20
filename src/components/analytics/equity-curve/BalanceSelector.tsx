import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const INITIAL_BALANCE_OPTIONS = [
  { value: 5000, label: "$5,000" },
  { value: 10000, label: "$10,000" },
  { value: 25000, label: "$25,000" },
  { value: 50000, label: "$50,000" },
  { value: 100000, label: "$100,000" },
  { value: 200000, label: "$200,000" },
];

interface BalanceSelectorProps {
  selectedBalance: number;
  onBalanceChange: (value: number) => void;
}

export const BalanceSelector = ({ selectedBalance, onBalanceChange }: BalanceSelectorProps) => {
  const [customBalance, setCustomBalance] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCustomBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(customBalance);
    if (!isNaN(value) && value > 0) {
      onBalanceChange(value);
      setIsOpen(false);
      setCustomBalance("");
    }
  };

  const isCustomValue = !INITIAL_BALANCE_OPTIONS.some(option => option.value === selectedBalance);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Initial Balance:</span>
      <Select
        value={isCustomValue ? "custom" : selectedBalance.toString()}
        onValueChange={(value) => {
          if (value === "custom") {
            setIsOpen(true);
          } else {
            onBalanceChange(Number(value));
          }
        }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue>
            {isCustomValue ? `$${selectedBalance.toLocaleString()}` : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {INITIAL_BALANCE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
          <SelectItem value="custom">Add custom</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div /> {/* Empty div as we don't need a visible trigger */}
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <form onSubmit={handleCustomBalanceSubmit} className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Custom Balance</h4>
              <p className="text-sm text-muted-foreground">
                Enter your initial balance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="1"
                value={customBalance}
                onChange={(e) => setCustomBalance(e.target.value)}
                placeholder="Enter amount"
                className="flex-1"
              />
              <Button type="submit">Set</Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};