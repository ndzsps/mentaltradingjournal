import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { Trade } from "@/types/trade";
import { TradingOutcome, MistakeCategory, TradingRule } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface PostSessionSectionProps {
  selectedOutcome: string;
  setSelectedOutcome: (value: string) => void;
  followedRules: string[];
  setFollowedRules: (value: string[]) => void;
  selectedMistakes: string[];
  setSelectedMistakes: (value: string[]) => void;
  tradingOutcome: TradingOutcome[];
  mistakeCategories: MistakeCategory[];
  tradingRules: TradingRule[];
  onAddTrade: () => void;
  trades: Trade[];
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
  followedRules,
  setFollowedRules,
  selectedMistakes,
  setSelectedMistakes,
  tradingOutcome,
  mistakeCategories,
  tradingRules,
  onAddTrade,
  trades,
}: PostSessionSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {tradingOutcome.map(({ icon: Icon, label, value }) => (
          <Button
            key={value}
            variant={selectedOutcome === value ? "default" : "outline"}
            className={`h-20 group transition-all duration-300 ${
              selectedOutcome === value 
                ? value === "loss" 
                  ? "bg-gradient-to-br from-[#FF6B6B] to-[#FF8787] text-white shadow-lg shadow-red-500/20"
                  : value === "win"
                    ? "bg-gradient-to-br from-[#40C057] to-[#69DB7C] text-white shadow-lg shadow-green-500/20"
                    : value === "breakeven"
                      ? "bg-gradient-to-br from-[#868E96] to-[#ADB5BD] text-white shadow-lg shadow-gray-500/20"
                      : "bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] text-white shadow-lg shadow-blue-500/20"
                : value === "loss"
                  ? "hover:bg-gradient-to-br hover:from-[#FFF5F5] hover:to-[#FFE3E3] hover:border-[#FF8787]/50 group-hover:text-[#FA5252]"
                  : value === "win"
                    ? "hover:bg-gradient-to-br hover:from-[#EBFBEE] hover:to-[#D3F9D8] hover:border-[#69DB7C]/50 group-hover:text-[#37B24D]"
                    : value === "breakeven"
                      ? "hover:bg-gradient-to-br hover:from-[#F1F3F5] hover:to-[#DEE2E6] hover:border-[#ADB5BD]/50 group-hover:text-[#495057]"
                      : "hover:bg-gradient-to-br hover:from-[#E7F5FE] hover:to-[#D3E4FD] hover:border-[#38BDF8]/50 group-hover:text-[#0EA5E9]"
            }`}
            onClick={() => setSelectedOutcome(value)}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${
                selectedOutcome === value 
                  ? "text-white" 
                  : value === "loss"
                    ? "text-[#FA5252] group-hover:text-[#FA5252]"
                    : value === "win"
                      ? "text-[#37B24D] group-hover:text-[#37B24D]"
                      : value === "breakeven"
                        ? "text-[#495057] group-hover:text-[#495057]"
                        : "text-[#0EA5E9] group-hover:text-[#0EA5E9]"
              }`} />
              <span className={`font-medium ${
                selectedOutcome === value 
                  ? "text-white" 
                  : value === "loss"
                    ? "text-[#FA5252] group-hover:text-[#FA5252]"
                    : value === "win"
                      ? "text-[#37B24D] group-hover:text-[#37B24D]"
                      : value === "breakeven"
                        ? "text-[#495057] group-hover:text-[#495057]"
                        : "text-[#0EA5E9] group-hover:text-[#0EA5E9]"
              }`}>
                {capitalizeWords(label)}
              </span>
            </div>
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            onClick={onAddTrade}
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white shadow-lg shadow-[#0EA5E9]/20"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Add Trade {trades.length > 0 && `(${trades.length})`}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] p-4">
                <p>You can add multiple trades by clicking 'Add Trade' before submitting your post-session review.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

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
    </>
  );
};