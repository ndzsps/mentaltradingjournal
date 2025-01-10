import { PostSessionSection } from "../PostSessionSection";
import { AddTradeDialog } from "../../analytics/AddTradeDialog";
import { Trade } from "@/types/trade";
import { tradingOutcome, mistakeCategories, tradingRules } from "../emotionConfig";

interface PostSessionFormSectionProps {
  selectedOutcome: string;
  setSelectedOutcome: (outcome: string) => void;
  followedRules: string[];
  setFollowedRules: (rules: string[]) => void;
  selectedMistakes: string[];
  setSelectedMistakes: (mistakes: string[]) => void;
  showAddTradeDialog: boolean;
  setShowAddTradeDialog: (show: boolean) => void;
  trades: Trade[];
  onTradeSubmit: (trade: Trade) => void;
}

export const PostSessionFormSection = ({
  selectedOutcome,
  setSelectedOutcome,
  followedRules,
  setFollowedRules,
  selectedMistakes,
  setSelectedMistakes,
  showAddTradeDialog,
  setShowAddTradeDialog,
  trades,
  onTradeSubmit,
}: PostSessionFormSectionProps) => {
  return (
    <>
      <PostSessionSection
        selectedOutcome={selectedOutcome}
        setSelectedOutcome={setSelectedOutcome}
        followedRules={followedRules}
        setFollowedRules={setFollowedRules}
        selectedMistakes={selectedMistakes}
        setSelectedMistakes={setSelectedMistakes}
        tradingOutcome={tradingOutcome}
        mistakeCategories={mistakeCategories}
        tradingRules={tradingRules}
        onAddTrade={() => setShowAddTradeDialog(true)}
        trades={trades}
      />

      <AddTradeDialog
        open={showAddTradeDialog}
        onOpenChange={setShowAddTradeDialog}
        onSubmit={onTradeSubmit}
      />
    </>
  );
};