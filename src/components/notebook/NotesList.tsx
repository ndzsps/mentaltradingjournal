import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
}

export const NotesList = ({ notes, isLoading, selectedNoteId, onSelectNote }: NotesListProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, noteId: string) => {
    e.dataTransfer.setData("noteId", noteId);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[88px] bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="p-4 space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedNoteId === note.id 
                ? "bg-accent border border-accent/20" 
                : "hover:bg-accent/10"
            }`}
            onClick={() => onSelectNote(note.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, note.id)}
          >
            <h3 className="font-medium mb-1 line-clamp-1">
              {note.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {note.content || "No content"}
            </p>
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs bg-primary/10 hover:bg-primary/20"
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