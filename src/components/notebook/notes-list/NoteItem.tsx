import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
}

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  getEmojiForNote: (id: string) => string | undefined;
}

export const NoteItem = ({ 
  note, 
  isSelected, 
  onSelect, 
  onDelete,
  getEmojiForNote 
}: NoteItemProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("noteId", note.id);
  };

  const handleChangeIcon = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Icon change feature coming soon!");
  };

  return (
    <div
      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
        isSelected 
          ? "bg-secondary/10 border border-secondary/20" 
          : "hover:bg-secondary/5"
      }`}
      onClick={() => onSelect(note.id)}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary/20 transition-colors">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleChangeIcon}>
              <Edit2 className="mr-2 h-4 w-4" />
              Change Icon
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg select-none" role="img" aria-label="note emoji">
          {getEmojiForNote(note.id)}
        </span>
        <h3 className="font-medium">
          {note.title || "Untitled"}
        </h3>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-secondary/10 hover:bg-secondary/20"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        {format(new Date(note.created_at), "d MMM yyyy")}
      </p>
    </div>
  );
};