
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EmojiPicker } from "./EmojiPicker";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
  emoji: string;
}

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteItem = ({ 
  note, 
  isSelected, 
  onSelect, 
  onDelete,
}: NoteItemProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("noteId", note.id);
  };

  const handleNoteClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.note-actions')) {
      onSelect(note.id);
    }
  };

  const handleEmojiSelect = () => {
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
        isSelected 
          ? "bg-secondary/10 border border-secondary/20" 
          : "hover:bg-secondary/5"
      }`}
      onClick={handleNoteClick}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity note-actions">
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary/20 transition-colors">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px]">
            <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Change Icon
                </DropdownMenuItem>
              </DialogTrigger>
              <EmojiPicker
                noteId={note.id}
                onEmojiSelect={handleEmojiSelect}
              />
            </Dialog>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(note.id)}
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
          {note.emoji || "📝"}
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
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300"
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
