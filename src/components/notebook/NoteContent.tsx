
import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FormatToolbar } from "./FormatToolbar";
import { useToast } from "@/components/ui/use-toast";

interface NoteContentProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

export const NoteContent = ({ content, onContentChange }: NoteContentProps) => {
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);
  const { toast } = useToast();

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      setToolbarPosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setToolbarPosition({
      x: rect.left + (rect.width / 2),
      y: rect.top + window.scrollY
    });
  }, []);

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
          toast({
            title: "Link added",
            description: `Added link to "${selectedText}"`,
          });
        }
        break;
    }

    if (formattedText) {
      const newContent = content.substring(0, start) + formattedText + content.substring(end);
      onContentChange(newContent);
    }

    setToolbarPosition(null);
  };

  return (
    <div className="relative">
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onSelect={handleSelectionChange}
        onBlur={() => {
          // Small delay to allow clicking toolbar buttons
          setTimeout(() => setToolbarPosition(null), 250);
        }}
        placeholder="Start writing..."
        className="min-h-[calc(100vh-300px)] resize-none !border-0 px-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 focus:!ring-0 focus:!ring-offset-0 !outline-none focus:!outline-none focus-visible:!outline-none hover:!outline-none active:!outline-none focus-within:!outline-none placeholder:text-muted-foreground/50 bg-transparent text-lg leading-relaxed transition-colors duration-200 !shadow-none hover:!shadow-none focus:!shadow-none active:!shadow-none [&:not(:disabled)]:!border-0 [&:not(:disabled)]:!outline-0 [&:not(:disabled)]:!ring-0 [&:not(:disabled)]:!shadow-none"
      />
      <FormatToolbar 
        position={toolbarPosition}
        onFormat={handleFormat}
      />
    </div>
  );
};
