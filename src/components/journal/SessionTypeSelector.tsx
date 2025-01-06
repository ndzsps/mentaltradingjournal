import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SessionTypeSelectorProps {
  sessionType: "pre" | "post";
  onSessionTypeChange: (value: "pre" | "post") => void;
}

export const SessionTypeSelector = ({
  sessionType,
  onSessionTypeChange,
}: SessionTypeSelectorProps) => {
  return (
    <RadioGroup
      defaultValue="pre"
      value={sessionType}
      onValueChange={onSessionTypeChange}
      className="flex space-x-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pre" id="pre" />
        <Label htmlFor="pre" className="font-medium">Pre-Session</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="post" id="post" />
        <Label htmlFor="post" className="font-medium">Post-Session</Label>
      </div>
    </RadioGroup>
  );
};