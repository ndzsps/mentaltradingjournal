import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddTradeDialog } from "../analytics/AddTradeDialog";
import { TradingOutcome, MistakeCategory, TradingRule } from "./types";
import { toast } from "sonner";

interface PostSessionSectionProps {
  selectedOutcome: string;
  setSelectedOutcome: (value: string) => void;
  marketConditions: string;
  setMarketConditions: (value: string) => void;
  followedRules: string[];
  setFollowedRules: (value: string[]) => void;
  selectedMistakes: string[];
  setSelectedMistakes: (value: string[]) => void;
  tradingOutcome: TradingOutcome[];
  mistakeCategories: MistakeCategory[];
  tradingRules: TradingRule[];
}

const capitalizeWords = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const PostSessionSection = ({
  selectedOutcome,
  setSelectedOutcome,
  marketConditions,
  setMarketConditions,
  followedRules,
  setFollowedRules,
  selectedMistakes,
  setSelectedMistakes,
  tradingOutcome,
  mistakeCategories,
  tradingRules,
}: PostSessionSectionProps) => {
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);

  const handleTradeSubmit = (tradeData: any, isEdit: boolean) => {
    console.log("Trade submitted:", tradeData);
    toast.success(isEdit ? "Trade updated successfully!" : "Trade added successfully!");
  };

  const getOutcomeStyles = (value: string) => {
    if (selectedOutcome === value) {
      if (value === "loss") {
        return "bg-gradient-to-br from-[#FF6B6B] to-[#FF8787] text-white shadow-lg shadow-red-500/20";
      }
      if (value === "win") {
        return "bg-gradient-to-br from-[#40C057] to-[#69DB7C] text-white shadow-lg shadow-green-500/20";
      }
      return "bg-gradient-to-br from-[#FAB005] to-[#FFD43B] text-white shadow-lg shadow-yellow-500/20";
    }
    if (value === "loss") {
      return "hover:bg-gradient-to-br hover:from-[#FFF5F5] hover:to-[#FFE3E3] hover:border-[#FF8787]/50 group-hover:text-[#FA5252]";
    }
    if (value === "win") {
      return "hover:bg-gradient-to-br hover:from-[#EBFBEE] hover:to-[#D3F9D8] hover:border-[#69DB7C]/50 group-hover:text-[#37B24D]";
    }
    return "hover:bg-gradient-to-br hover:from-[#FFF9DB] hover:to-[#FFE066] hover:border-[#FFD43B]/50 group-hover:text-[#F59F00]";
  };

  const getIconColor = (value: string) => {
    if (selectedOutcome === value) return "text-white";
    if (value === "loss") return "text-[#FA5252] group-hover:text-[#FA5252]";
    if (value === "win") return "text-[#37B24D] group-hover:text-[#37B24D]";
    return "text-[#F59F00] group-hover:text-[#F59F00]";
  };

  const marketConditionOptions = [
    { value: "low_volatility", label: "Low Volatility" },
    { value: "medium_volatility", label: "Medium Volatility" },
    { value: "high_volatility", label: "High Volatility" },
    { value: "trending", label: "Trending" },
    { value: "ranging", label: "Ranging" },
    { value: "news_driven", label: "News Driven" },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {tradingOutcome.map(({ icon: Icon, label, value }) => (
          <Button
            key={value}
            variant={selectedOutcome === value ? "default" : "outline"}
            className={`h-20 group transition-all duration-300 ${getOutcomeStyles(value)}`}
            onClick={() => setSelectedOutcome(value)}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${getIconColor(value)}`} />
              <span className={`font-medium ${selectedOutcome === value ? "text-white" : getIconColor(value)}`}>
                {capitalizeWords(label)}
              </span>
            </div>
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Market Conditions</Label>
        <Select value={marketConditions} onValueChange={setMarketConditions}>
          <SelectTrigger>
            <SelectValue placeholder="Select market conditions" />
          </SelectTrigger>
          <SelectContent>
            {marketConditionOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <Button
          onClick={() => setShowAddTradeDialog(true)}
          className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white shadow-lg shadow-[#0EA5E9]/20"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Trade
        </Button>

        <div className="space-y-4">
          <Label className="text-lg font-medium">Trading Rules Followed</Label>
          <div className="grid grid-cols-2 gap-4">
            {tradingRules.map((rule) => (
              <div key={rule.value} className="flex items-center space-x-2">
                <Checkbox
                  id={rule.value}
                  checked={followedRules.includes(rule.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFollowedRules([...followedRules, rule.value]);
                    } else {
                      setFollowedRules(followedRules.filter(r => r !== rule.value));
                    }
                  }}
                />
                <Label htmlFor={rule.value}>{capitalizeWords(rule.label)}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedOutcome === "loss" && (
        <div className="space-y-4">
          <Label className="text-lg font-medium">Mistake Categories</Label>
          <div className="grid grid-cols-2 gap-4">
            {mistakeCategories.map((mistake) => (
              <div key={mistake.value} className="flex items-center space-x-2">
                <Checkbox
                  id={mistake.value}
                  checked={selectedMistakes.includes(mistake.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedMistakes([...selectedMistakes, mistake.value]);
                    } else {
                      setSelectedMistakes(selectedMistakes.filter(m => m !== mistake.value));
                    }
                  }}
                />
                <Label htmlFor={mistake.value}>{capitalizeWords(mistake.label)}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddTradeDialog
        open={showAddTradeDialog}
        onOpenChange={setShowAddTradeDialog}
        onSubmit={handleTradeSubmit}
      />
    </>
  );
};
