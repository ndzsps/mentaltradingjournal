import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteItem } from "./notes-list/NoteItem";
import { NotesLoadingSkeleton } from "./notes-list/NotesLoadingSkeleton";
import { NotesEmptyState } from "./notes-list/NotesEmptyState";

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

// Default emojis for different note contexts
const defaultEmojis = ["📝", "🎯", "💡", "🔥", "🎨", "📊", "🌟", "📌", "🔍", "📚"];

// Use a Map to store consistent emojis for each note
const noteEmojis = new Map<string, string>();

export const NotesList = ({ 
  notes, 
  isLoading, 
  selectedNoteId, 
  onSelectNote,
  onDeleteNote 
}: NotesListProps) => {
  const getEmojiForNote = (noteId: string) => {
    if (!noteEmojis.has(noteId)) {
      // If this note doesn't have an emoji yet, assign one randomly
      noteEmojis.set(noteId, defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)]);
    }
    return noteEmojis.get(noteId);
  };

  if (isLoading) {
    return <NotesLoadingSkeleton />;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-2">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isSelected={selectedNoteId === note.id}
            onSelect={onSelectNote}
            onDelete={onDeleteNote}
            getEmojiForNote={getEmojiForNote}
          />
        ))}
        {notes.length === 0 && <NotesEmptyState />}
      </div>
    </ScrollArea>
  );
};