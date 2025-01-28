import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X } from "lucide-react";

interface NoteTagsProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const NoteTags = ({ tags, onAddTag, onRemoveTag }: NoteTagsProps) => {
  const [newTag, setNewTag] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center min-h-[32px] opacity-70 hover:opacity-100 transition-opacity duration-200">
      {tags.map((tag) => (
        <Badge 
          key={tag} 
          variant="secondary" 
          className="gap-1 bg-secondary-hover hover:bg-secondary/10 transition-colors duration-200"
        >
          {tag}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" 
            onClick={() => onRemoveTag(tag)}
          />
        </Badge>
      ))}
      <div className="flex items-center gap-2 group">
        <PlusCircle className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="border-none w-24 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 bg-transparent transition-colors duration-200"
        />
      </div>
    </div>
  );
};