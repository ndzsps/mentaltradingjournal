import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
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

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  selectedNoteId: string | null;
  onSelectNote: (id: string | null) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesList = ({ notes, isLoading, selectedNoteId, onSelectNote, onDeleteNote }: NotesListProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, noteId: string) => {
    e.dataTransfer.setData("noteId", noteId);
  };

  const handleChangeIcon = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent note selection when changing icon
    // TODO: Implement icon change functionality
    toast.info("Icon change feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
              selectedNoteId === note.id 
                ? "bg-secondary/10 border border-secondary/20" 
                : "hover:bg-secondary/5"
            }`}
            onClick={() => onSelectNote(note.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, note.id)}
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary/20 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={(e) => handleChangeIcon(note.id, e)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Change Icon
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="font-medium mb-1">
              {note.title || "Untitled"}
            </h3>
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
        ))}
        {notes.length === 0 && (
          <p className="text-center text-muted-foreground py-2">
            No notes yet. Create one to get started!
          </p>
        )}
      </div>
    </ScrollArea>
  );
};