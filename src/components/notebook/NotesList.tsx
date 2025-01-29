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
      <ScrollArea className="h-[calc(100vh-12rem)] flex-1">
        <div className="animate-pulse p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-background/5 rounded-lg" />
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] flex-1">
      <div className="p-4 space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/5 ${
              selectedNoteId === note.id ? "bg-primary/10" : "bg-background/5"
            }`}
            onClick={() => onSelectNote(note.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, note.id)}
          >
            <h3 className="font-medium mb-1 line-clamp-1 text-foreground/90">{note.title}</h3>
            <p className="text-sm text-muted-foreground/70 line-clamp-2">
              {note.content || "No content"}
            </p>
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs bg-primary/10 text-primary-foreground/70 hover:bg-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground/50 mt-2">
              {format(new Date(note.created_at), "d MMM yyyy")}
            </p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-center text-muted-foreground/50 py-4">
            No notes yet. Create one to get started!
          </p>
        )}
      </div>
    </ScrollArea>
  );
};