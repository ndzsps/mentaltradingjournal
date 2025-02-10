
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, MoreVertical } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface NoteTagsProps {
  tags: string[];
  tagColors: Record<string, string>;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onUpdateTagColor: (tag: string, color: string) => void;
}

const TAG_COLORS = {
  purple: "bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300",
  blue: "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300",
  green: "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300",
  yellow: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-300",
  red: "bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300",
  pink: "bg-pink-100 hover:bg-pink-200 text-pink-800 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:text-pink-300",
};

export const NoteTags = ({ 
  tags, 
  tagColors, 
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

  const getTagColorClass = (tag: string) => {
    return tagColors[tag] ? TAG_COLORS[tagColors[tag] as keyof typeof TAG_COLORS] : TAG_COLORS.purple;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center min-h-[32px] opacity-70 hover:opacity-100 transition-opacity duration-200">
      {tags.map((tag) => (
        <div key={tag} className="group relative flex items-center">
          <Badge 
            variant="secondary" 
            className={cn("gap-1 transition-colors duration-200", getTagColorClass(tag))}
          >
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" 
              onClick={() => onRemoveTag(tag)}
            />
          </Badge>
          <Popover>
            <PopoverTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded hover:bg-secondary/20 transition-all">
                <MoreVertical className="h-3 w-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex gap-1">
                {Object.keys(TAG_COLORS).map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateTagColor(tag, color)}
                    className={cn(
                      "w-6 h-6 rounded-full transition-all",
                      TAG_COLORS[color as keyof typeof TAG_COLORS],
                      tagColors[tag] === color && "ring-2 ring-offset-2 ring-primary"
                    )}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
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
