import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { emotions } from "../emotionConfig";

interface EmotionFilterDropdownProps {
  emotionFilter: string | null;
  setEmotionFilter: (value: string | null) => void;
}

export const EmotionFilterDropdown = ({
  emotionFilter,
  setEmotionFilter,
}: EmotionFilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Emotion <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filter by Emotion</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setEmotionFilter(null)}>
          All Emotions
        </DropdownMenuItem>
        {emotions.map(emotion => (
          <DropdownMenuItem 
            key={emotion.value}
            onClick={() => setEmotionFilter(emotion.label)}
          >
            {emotion.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};