
import { Textarea } from "@/components/ui/textarea";

interface NoteContentProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

export const NoteContent = ({ content, onContentChange }: NoteContentProps) => {
  return (
    <Textarea
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      placeholder="Start writing..."
      className="min-h-[calc(100vh-300px)] resize-none border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 bg-transparent text-lg leading-relaxed transition-colors duration-200 dark:text-white/90"
      spellCheck={false}
    />
  );
};
