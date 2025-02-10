
import { Bold, Italic, Underline, Link } from "lucide-react";
import { Button } from "../ui/button";

interface FormatToolbarProps {
  onFormat: (type: 'bold' | 'italic' | 'underline' | 'link') => void;
  position: { x: number; y: number } | null;
}

export const FormatToolbar = ({ onFormat, position }: FormatToolbarProps) => {
  if (!position) return null;

  return (
    <div 
      className="fixed z-50 flex gap-1 p-1 rounded-md bg-gray-900/90 backdrop-blur-sm shadow-lg border border-gray-800"
      style={{ 
        top: `${Math.max(position.y - 45, 10)}px`, // Position slightly higher above text
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)', // Center horizontally and position above
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-200 hover:text-white hover:bg-gray-800"
        onClick={() => onFormat('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-200 hover:text-white hover:bg-gray-800"
        onClick={() => onFormat('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-200 hover:text-white hover:bg-gray-800"
        onClick={() => onFormat('underline')}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-200 hover:text-white hover:bg-gray-800"
        onClick={() => onFormat('link')}
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
};
