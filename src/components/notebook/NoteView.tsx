
import { useAuth } from "@/contexts/AuthContext";
import { NoteTitle } from "./NoteTitle";
import { NoteTags } from "./NoteTags";
import { NoteContent } from "./NoteContent";
import { FormatToolbar } from "./FormatToolbar";
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

  const handleBold = () => {
    // TODO: Implement bold formatting
    console.log("Bold clicked");
  };

  const handleItalic = () => {
    // TODO: Implement italic formatting
    console.log("Italic clicked");
  };

  const handleUnderline = () => {
    // TODO: Implement underline formatting
    console.log("Underline clicked");
  };

  const handleStrikethrough = () => {
    // TODO: Implement strikethrough formatting
    console.log("Strikethrough clicked");
  };

  const handleLink = () => {
    // TODO: Implement link formatting
    console.log("Link clicked");
  };

  const handleColorChange = () => {
    // TODO: Implement color change
    console.log("Color change clicked");
  };

  if (!noteId) {
    return <EmptyNoteState />;
  }

  if (isLoading) {
    return <NoteViewSkeleton />;
  }

  return (
    <div className="h-full bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <NoteTitle title={title} onTitleChange={handleTitleChange} />
        <NoteTags 
          tags={tags} 
          tagColors={tagColors}
          onAddTag={handleAddTag} 
          onRemoveTag={handleRemoveTag} 
          onUpdateTagColor={handleUpdateTagColor}
        />
        <FormatToolbar 
          onBold={handleBold}
          onItalic={handleItalic}
          onUnderline={handleUnderline}
          onStrikethrough={handleStrikethrough}
          onLink={handleLink}
          onColorChange={handleColorChange}
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
