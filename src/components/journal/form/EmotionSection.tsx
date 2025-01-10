import { EmotionDetailDialog } from "../EmotionDetailDialog";
import { EmotionSelector } from "../EmotionSelector";
import { emotions } from "../emotionConfig"; // Added this import

interface EmotionSectionProps {
  sessionType: "pre" | "post";
  selectedEmotion: string;
  selectedEmotionDetail: string;
  isDetailDialogOpen: boolean;
  customDetails: string[];
  onEmotionSelect: (value: string) => void;
  onDetailSelect: (detail: string) => void;
  onDetailDialogOpenChange: (open: boolean) => void;
  onCustomDetailAdd: (detail: string) => void;
}

export const EmotionSection = ({
  sessionType,
  selectedEmotion,
  selectedEmotionDetail,
  isDetailDialogOpen,
  customDetails,
  onEmotionSelect,
  onDetailSelect,
  onDetailDialogOpenChange,
  onCustomDetailAdd,
}: EmotionSectionProps) => {
  return (
    <div className="space-y-6">
      <EmotionSelector
        selectedEmotion={selectedEmotion}
        onEmotionSelect={onEmotionSelect}
      />

      {sessionType === "post" && (
        <EmotionDetailDialog
          isOpen={isDetailDialogOpen}
          onOpenChange={onDetailDialogOpenChange}
          details={selectedEmotion ? emotions.find(e => e.value === selectedEmotion)?.details || [] : []}
          onDetailSelect={onDetailSelect}
          selectedDetail={selectedEmotionDetail}
          customDetails={customDetails}
          onCustomDetailAdd={onCustomDetailAdd}
        />
      )}
    </div>
  );
};
