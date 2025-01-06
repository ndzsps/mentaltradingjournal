import { Button } from "@/components/ui/button";
import { emotions } from "./emotionConfig";

interface EmotionSelectorProps {
  selectedEmotion: string;
  onEmotionSelect: (value: string) => void;
}

export const EmotionSelector = ({
  selectedEmotion,
  onEmotionSelect,
}: EmotionSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {emotions.map(({ icon: Icon, label, value }) => (
        <Button
          key={value}
          variant={selectedEmotion === value ? "default" : "outline"}
          className={`h-24 group transition-all duration-300 ${
            selectedEmotion === value 
              ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground shadow-lg shadow-primary/20" 
              : "hover:border-primary/50 hover:bg-primary-hover text-foreground hover:text-foreground"
          }`}
          onClick={() => onEmotionSelect(value)}
        >
          <div className="flex flex-col items-center gap-3">
            <Icon className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${
              selectedEmotion === value ? "text-primary-foreground" : "text-primary"
            }`} />
            <span className="font-medium">{label}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};