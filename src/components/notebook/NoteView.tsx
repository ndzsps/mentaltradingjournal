import { useAuth } from "@/contexts/AuthContext";
import { NoteTitle } from "./NoteTitle";
import { NoteTags } from "./NoteTags";
import { NoteContent } from "./NoteContent";
import { FormatToolbar } from "./FormatToolbar";
import { Separator } from "@/components/ui/separator";
import { NoteViewSkeleton } from "./NoteViewSkeleton";
import { EmptyNoteState } from "./EmptyNoteState";
import { useNote } from "@/hooks/useNote";
import { useState } from "react";
import { LinkDialog } from "./LinkDialog";
import { ColorPickerDialog } from "./ColorPickerDialog";

interface NoteViewProps {
  noteId: string | null;
}

export const NoteView = ({ noteId }: NoteViewProps) => {
  const { user } = useAuth();
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
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

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const handleBold = () => {
    execCommand('bold');
  };

  const handleItalic = () => {
    execCommand('italic');
  };

  const handleUnderline = () => {
    execCommand('underline');
  };

  const handleStrikethrough = () => {
    execCommand('strikeThrough');
  };

  const handleLink = () => {
    setIsLinkDialogOpen(true);
  };

  const handleLinkSubmit = (url: string) => {
    // Get the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    // Format URL if needed
    const formattedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    
    // Store the selection range
    const range = selection.getRangeAt(0);
    
    // If no text is selected, insert the URL as text
    if (range.collapsed) {
      const textNode = document.createTextNode(formattedUrl);
      range.insertNode(textNode);
      range.selectNode(textNode);
    }
    
    // Create the link
    execCommand('createLink', formattedUrl);
    console.log('Creating link with URL:', formattedUrl);
  };

  const handleColorChange = () => {
    setIsColorPickerOpen(true);
  };

  const handleColorSelect = (color: string) => {
    execCommand('foreColor', color);
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
        <LinkDialog 
          isOpen={isLinkDialogOpen}
          onClose={() => setIsLinkDialogOpen(false)}
          onSubmit={handleLinkSubmit}
        />
        <ColorPickerDialog
          isOpen={isColorPickerOpen}
          onClose={() => setIsColorPickerOpen(false)}
          onColorSelect={handleColorSelect}
        />
      </div>
    </div>
  );
};
