import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Blueprint {
  id: string;
  name: string;
}

interface PlaybookSelectorProps {
  blueprints: Blueprint[];
  selectedBlueprint: string | undefined;
  onBlueprintSelect: (value: string) => void;
}

export function PlaybookSelector({ blueprints, selectedBlueprint, onBlueprintSelect }: PlaybookSelectorProps) {
  return (
    <div className="mb-6">
      <Label htmlFor="playbook">Select Playbook *</Label>
      <Select value={selectedBlueprint} onValueChange={onBlueprintSelect}>
        <SelectTrigger className="w-full mt-2">
          <SelectValue placeholder="Choose a playbook" />
        </SelectTrigger>
        <SelectContent>
          {blueprints.map((blueprint) => (
            <SelectItem key={blueprint.id} value={blueprint.id}>
              {blueprint.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}