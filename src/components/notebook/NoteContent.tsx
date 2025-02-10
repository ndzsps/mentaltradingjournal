
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

    // Only set the content if it has changed and the editor isn't focused
    if (!editor.isEqualNode(document.activeElement)) {
      editor.innerHTML = content || '';
      
      // Add click handlers to all links
      const links = editor.getElementsByTagName('a');
      Array.from(links).forEach(link => {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      });
      
      console.log('Setting content:', content); // Debug log
    }
  }, [content]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      const newContent = editor.innerHTML;
      console.log('Content changed to:', newContent); // Debug log
      onContentChange(newContent);
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');
      if (text) {
        document.execCommand('insertText', false, text);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        e.preventDefault();
        const link = target.tagName === 'A' ? target : target.closest('a');
        const href = link?.getAttribute('href');
        if (href) {
          console.log('Opening link:', href);
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      }
    };

    editor.addEventListener('input', handleInput);
    editor.addEventListener('paste', handlePaste);
    editor.addEventListener('click', handleClick);
    
    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('paste', handlePaste);
      editor.removeEventListener('click', handleClick);
    };
  }, [onContentChange]);

  return (
    <div
      ref={editorRef}
      contentEditable
      className="min-h-[calc(100vh-300px)] focus:outline-none focus-visible:outline-none text-lg leading-relaxed transition-colors duration-200 prose prose-sm max-w-none dark:prose-invert prose-p:my-0 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline prose-a:cursor-pointer"
      style={{
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}
      role="textbox"
      aria-multiline="true"
      onKeyDown={(e) => {
        // Prevent the default behavior of Enter key to maintain consistent formatting
        if (e.key === 'Enter') {
          e.preventDefault();
          document.execCommand('insertHTML', false, '<br><br>');
        }
      }}
      dangerouslySetInnerHTML={{ __html: content || '' }}
    />
  );
};
