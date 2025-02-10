
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TAG_COLORS = {
  purple: {
    base: "bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300",
    name: "Purple"
  },
  blue: {
    base: "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300",
    name: "Blue"
  },
  green: {
    base: "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300",
    name: "Green"
  },
  yellow: {
    base: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-300",
    name: "Yellow"
  },
  red: {
    base: "bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300",
    name: "Red"
  },
  pink: {
    base: "bg-pink-100 hover:bg-pink-200 text-pink-800 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:text-pink-300",
    name: "Pink"
  },
  indigo: {
    base: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300",
    name: "Indigo"
  },
  orange: {
    base: "bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300",
    name: "Orange"
  },
  teal: {
    base: "bg-teal-100 hover:bg-teal-200 text-teal-800 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 dark:text-teal-300",
    name: "Teal"
  },
  rose: {
    base: "bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 dark:text-rose-300",
    name: "Rose"
  },
};

interface NoteTagsProps {
  tags: string[];
  tagColors?: Record<string, string>;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onUpdateTagColor?: (tag: string, color: string) => void;
}

export const NoteTags = ({ 
  tags, 
  tagColors = {}, 
  onAddTag, 
  onRemoveTag,
  onUpdateTagColor 
}: NoteTagsProps) => {
  const [newTag, setNewTag] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  const getTagColorClasses = (tag: string) => {
    return TAG_COLORS[tagColors[tag] as keyof typeof TAG_COLORS]?.base || TAG_COLORS.purple.base;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center min-h-[32px] opacity-70 hover:opacity-100 transition-opacity duration-200">
      {tags.map((tag) => (
        <div key={tag} className="flex items-center gap-1">
          <Badge 
            variant="secondary" 
            className={`gap-1 transition-colors duration-200 ${getTagColorClasses(tag)}`}
          >
            <div className="flex items-center gap-1">
              {tag}
              <div className="flex items-center gap-1">
                {onUpdateTagColor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Palette className="h-3 w-3 hover:text-foreground transition-colors duration-200" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      {Object.entries(TAG_COLORS).map(([colorKey, colorValue]) => (
                        <DropdownMenuItem
                          key={colorKey}
                          onClick={() => onUpdateTagColor(tag, colorKey)}
                          className={`flex items-center gap-2 ${TAG_COLORS[colorKey as keyof typeof TAG_COLORS].base}`}
                        >
                          {colorValue.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" 
                  onClick={() => onRemoveTag(tag)}
                />
              </div>
            </div>
          </Badge>
        </div>
      ))}
      <div className="flex items-center gap-2 group">
        <PlusCircle className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="border-none w-24 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 bg-transparent transition-colors duration-200 outline-none"
        />
      </div>
    </div>
  );
};
