
import { useAuth } from "@/contexts/AuthContext";
import { NoteTitle } from "./NoteTitle";
import { NoteTags } from "./NoteTags";
import { NoteContent } from "./NoteContent";
import { Separator } from "@/components/ui/separator";
import { NoteViewSkeleton } from "./NoteViewSkeleton";
import { EmptyNoteState } from "./EmptyNoteState";
import { useNote } from "@/hooks/useNote";

interface NoteViewProps {
  noteId: string | null;
}

export const NoteView = ({ noteId }: NoteViewProps) => {
  const { user } = useAuth();
  const {
    isLoading,
    title,
    content,
    tags,
    tagColors,
    handleTitleChange,
    handleContentChange,
    handleAddTag,
    handleRemoveTag,
    handleUpdateTagColor,
  } = useNote(noteId, user);

  if (!noteId) {
    return <EmptyNoteState />;
  }

  if (isLoading) {
    return <NoteViewSkeleton />;
  }

  return (
    <div className="h-full bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <NoteTitle title={title} onTitleChange={handleTitleChange} />
        <NoteTags 
          tags={tags} 
          tagColors={tagColors}
          onAddTag={handleAddTag} 
          onRemoveTag={handleRemoveTag} 
          onUpdateTagColor={handleUpdateTagColor}
        />
        <Separator className="my-4" />
        <NoteContent 
          content={content} 
          onContentChange={handleContentChange} 
        />
      </div>
    </div>
  );
};
