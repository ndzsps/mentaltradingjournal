
import { Checkbox } from "@/components/ui/checkbox";

interface MistakesSectionProps {
  selectedMistakes: string[];
  setSelectedMistakes: (mistakes: string[]) => void;
  mistakeCategories: { label: string; value: string }[];
}

export const MistakesSection = ({
  selectedMistakes,
  setSelectedMistakes,
  mistakeCategories,
}: MistakesSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Trading Mistakes</h3>
      <div className="grid gap-4">
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
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor={mistake.value}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {mistake.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
