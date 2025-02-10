
import { Input } from "@/components/ui/input";

interface NoteTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export const NoteTitle = ({ title, onTitleChange }: NoteTitleProps) => {
  return (
    <Input
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
      placeholder="Untitled"
      className="[&:not(:disabled)]:text-4xl font-semibold bg-transparent border-none px-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none outline-none focus:ring-0 ring-0 focus:ring-offset-0 ring-offset-0 focus:border-none active:outline-none focus-within:outline-none placeholder:text-muted-foreground/50 transition-colors duration-200"
    />
  );
};
