import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trade } from "@/types/trade";
import { TradesList } from "./entry/TradesList";
import { TradingRules } from "./entry/TradingRules";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThumbsUp, Equal, ThumbsDown, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface PostSessionSectionProps {
  selectedOutcome: string;
  setSelectedOutcome: (outcome: string) => void;
  followedRules: string[];
  setFollowedRules: (rules: string[]) => void;
  selectedMistakes: string[];
  setSelectedMistakes: (mistakes: string[]) => void;
  tradingOutcome: { label: string; value: string }[];
  mistakeCategories: { label: string; value: string }[];
  tradingRules: { label: string; value: string }[];
  trades: Trade[];
}

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
  trades,
}: PostSessionSectionProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Trading Outcome</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select the outcome of your trading session
            </p>
            <RadioGroup
              value={selectedOutcome}
              onValueChange={setSelectedOutcome}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="win"
                  id="win"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="win"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <ThumbsUp className="mb-2 h-6 w-6 text-green-500" />
                  <span>Win</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="breakeven"
                  id="breakeven"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="breakeven"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Equal className="mb-2 h-6 w-6 text-yellow-500" />
                  <span>Breakeven</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="loss"
                  id="loss"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="loss"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <ThumbsDown className="mb-2 h-6 w-6 text-red-500" />
                  <span>Loss</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="no_trades"
                  id="no_trades"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="no_trades"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <XCircle className="mb-2 h-6 w-6 text-blue-500" />
                  <span>No Trades</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Trading Rules Followed</h3>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="position_sizing"
                  checked={followedRules.includes('position_sizing')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFollowedRules([...followedRules, 'position_sizing']);
                    } else {
                      setFollowedRules(followedRules.filter(rule => rule !== 'position_sizing'));
                    }
                  }}
                />
                <label
                  htmlFor="position_sizing"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Proper position sizing
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="entry_criteria"
                  checked={followedRules.includes('entry_criteria')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFollowedRules([...followedRules, 'entry_criteria']);
                    } else {
                      setFollowedRules(followedRules.filter(rule => rule !== 'entry_criteria'));
                    }
                  }}
                />
                <label
                  htmlFor="entry_criteria"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Entry Criteria
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exit_strategy"
                  checked={followedRules.includes('exit_strategy')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFollowedRules([...followedRules, 'exit_strategy']);
                    } else {
                      setFollowedRules(followedRules.filter(rule => rule !== 'exit_strategy'));
                    }
                  }}
                />
                <label
                  htmlFor="exit_strategy"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Exit Strategy
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {trades && trades.length > 0 && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Trades</h3>
              <p className="text-sm text-muted-foreground">
                Review your trades for this session
              </p>
            </div>
            <TradesList trades={trades} />
          </div>
        </Card>
      )}

      <Separator />
    </div>
  );
};