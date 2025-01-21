import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trade } from "@/types/trade";
import { TradesList } from "./entry/TradesList";
import { TradingRules } from "./entry/TradingRules";

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
            <h3 className="text-lg font-medium">Trading Rules</h3>
            <p className="text-sm text-muted-foreground">
              Select the trading rules you followed in this session
            </p>
          </div>
          <TradingRules rules={followedRules} />
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