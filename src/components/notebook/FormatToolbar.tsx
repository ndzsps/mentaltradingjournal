
import { Bold, Italic, Underline, Strikethrough, Link, Palette } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface FormatToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrikethrough: () => void;
  onLink: () => void;
  onColorChange: () => void;
}

export const FormatToolbar = ({
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onLink,
  onColorChange
}: FormatToolbarProps) => {
  return (
    <div className="flex items-center gap-1 mb-4 opacity-70 hover:opacity-100 transition-opacity duration-200">
      <Toggle size="sm" onClick={onBold} aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onClick={onItalic} aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onClick={onUnderline} aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onClick={onStrikethrough} aria-label="Toggle strikethrough">
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onClick={onLink} aria-label="Add link">
        <Link className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onClick={onColorChange} aria-label="Change text color">
        <Palette className="h-4 w-4" />
      </Toggle>
    </div>
  );
};
