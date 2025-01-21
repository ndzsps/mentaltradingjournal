import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trade } from "@/types/trade";
import { TradesList } from "./entry/TradesList";
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
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Trading Outcome</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Select the outcome of your trading session
            </p>
            <RadioGroup
              value={selectedOutcome}
              onValueChange={setSelectedOutcome}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <div>
                <RadioGroupItem
                  value="win"
                  id="win"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="win"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <ThumbsUp className="mb-1 h-5 w-5 text-green-500" />
                  <span className="text-sm">Win</span>
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
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <Equal className="mb-1 h-5 w-5 text-gray-500" />
                  <span className="text-sm">Breakeven</span>
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
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <ThumbsDown className="mb-1 h-5 w-5 text-red-500" />
                  <span className="text-sm">Loss</span>
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
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <XCircle className="mb-1 h-5 w-5 text-blue-500" />
                  <span className="text-sm">No Trades</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-lg font-medium mb-3">Trading Rules Followed</h3>
            <div className="space-y-3">
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
                  className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="position_sizing"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                  className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="entry_criteria"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                  className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="exit_strategy"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Exit Strategy
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {trades && trades.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
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
    </div>
  );
};