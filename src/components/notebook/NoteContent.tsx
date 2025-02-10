
import { useEffect, useRef } from "react";

interface NoteContentProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

export const NoteContent = ({ content, onContentChange }: NoteContentProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Only set the innerHTML if the content has changed and the editor isn't focused
    if (!editor.isEqualNode(document.activeElement)) {
      editor.innerHTML = content;
    }
  }, [content]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      onContentChange(editor.innerHTML);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href) {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      }
    };

    editor.addEventListener('input', handleInput);
    editor.addEventListener('click', handleClick);
    
    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('click', handleClick);
    };
  }, [onContentChange]);

  return (
    <div
      ref={editorRef}
      contentEditable
      className="min-h-[calc(100vh-300px)] focus:outline-none focus-visible:outline-none text-lg leading-relaxed transition-colors duration-200 prose prose-sm max-w-none dark:prose-invert prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-a:cursor-pointer"
      role="textbox"
      aria-multiline="true"
    />
  );
};
