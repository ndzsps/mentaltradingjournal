
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
      className="min-h-[calc(100vh-300px)] resize-none !border-0 px-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 focus:!ring-0 focus:!ring-offset-0 !outline-none focus:!outline-none focus-visible:!outline-none hover:!outline-none active:!outline-none focus-within:!outline-none placeholder:text-muted-foreground/50 bg-transparent text-lg leading-relaxed transition-colors duration-200 !shadow-none hover:!shadow-none focus:!shadow-none active:!shadow-none [&:not(:disabled)]:!border-0 [&:not(:disabled)]:!outline-0 [&:not(:disabled)]:!ring-0 [&:not(:disabled)]:!shadow-none"
    />
  );
};
