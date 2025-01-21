import { PostSessionSection } from "../PostSessionSection";
import { Trade } from "@/types/trade";
import { tradingOutcome, mistakeCategories, tradingRules } from "../emotionConfig";

interface PostSessionFormSectionProps {
  selectedOutcome: string;
  setSelectedOutcome: (outcome: string) => void;
  followedRules: string[];
  setFollowedRules: (rules: string[]) => void;
  selectedMistakes: string[];
  setSelectedMistakes: (mistakes: string[]) => void;
  trades: Trade[];
}

export const PostSessionFormSection = ({
  selectedOutcome,
  setSelectedOutcome,
  followedRules,
  setFollowedRules,
  selectedMistakes,
  setSelectedMistakes,
  trades,
}: PostSessionFormSectionProps) => {
  return (
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
      trades={trades}
    />
  );
};