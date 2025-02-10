
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

const TAG_COLORS = {
  purple: {
    base: "bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300",
  },
  blue: {
    base: "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300",
  },
  green: {
    base: "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300",
  },
  yellow: {
    base: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-300",
  },
  red: {
    base: "bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300",
  },
  pink: {
    base: "bg-pink-100 hover:bg-pink-200 text-pink-800 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:text-pink-300",
  },
  indigo: {
    base: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300",
  },
  orange: {
    base: "bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300",
  },
  teal: {
    base: "bg-teal-100 hover:bg-teal-200 text-teal-800 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 dark:text-teal-300",
  },
  rose: {
    base: "bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 dark:text-rose-300",
  },
};

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
  emoji: string;
  tag_colors?: Record<string, string>;
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

  const getTagColorClasses = (tag: string) => {
    return TAG_COLORS[note.tag_colors?.[tag] as keyof typeof TAG_COLORS]?.base || TAG_COLORS.purple.base;
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
              className={`text-xs ${getTagColorClasses(tag)}`}
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
