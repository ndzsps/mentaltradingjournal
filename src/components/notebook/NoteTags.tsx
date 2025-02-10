
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
        <div key={tag} className="group relative flex items-center gap-1">
          <Badge 
            variant="secondary" 
            className={cn("transition-colors duration-200", getTagColorClass(tag))}
          >
            {tag}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary/20 transition-all">
                <MoreHorizontal className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem 
                onClick={() => onRemoveTag(tag)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="w-full">
                  <p className="text-xs text-muted-foreground mb-2">Colors</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(TAG_COLORS).map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateTagColor(tag, color)}
                        className={cn(
                          "w-5 h-5 rounded-full transition-all",
                          TAG_COLORS[color as keyof typeof TAG_COLORS],
                          tagColors[tag] === color && "ring-2 ring-offset-2 ring-primary"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

