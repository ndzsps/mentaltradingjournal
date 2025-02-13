
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Initial Balance:</span>
      <Select
        value={selectedBalance.toString()}
        onValueChange={(value) => onBalanceChange(Number(value))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {INITIAL_BALANCE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
