
import { useAuth } from "@/contexts/AuthContext";
import { NoteTitle } from "./NoteTitle";
import { NoteTags } from "./NoteTags";
import { NoteContent } from "./NoteContent";
import { Separator } from "@/components/ui/separator";
import { NoteViewSkeleton } from "./NoteViewSkeleton";
import { EmptyNoteState } from "./EmptyNoteState";
import { useNote } from "@/hooks/useNote";
import { FormatToolbar } from "./FormatToolbar";

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

  const handleFormat = (type: 'bold' | 'italic' | 'underline' | 'link') => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    const selectedText = selection.toString();
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let formattedText = '';
    let url = '';

    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
      case 'link':
        url = prompt('Enter URL:', 'https://') || '';
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        }
        break;
    }

    if (formattedText) {
      const newContent = content.substring(0, start) + formattedText + content.substring(end);
      handleContentChange(newContent);
    }
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
        <Separator className="my-4" />
        <FormatToolbar onFormat={handleFormat} />
        <NoteContent 
          content={content} 
          onContentChange={handleContentChange} 
        />
      </div>
    </div>
  );
};
