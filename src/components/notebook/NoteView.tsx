import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X } from "lucide-react";

interface NoteViewProps {
  noteId: string | null;
}

export const NoteView = ({ noteId }: NoteViewProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      if (!noteId || !user) return null;

      const { data, error } = await supabase
        .from("notebook_notes")
        .select("*")
        .eq("id", noteId)
        .eq("user_id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!noteId && !!user,
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
    }
  }, [note]);

  const updateNote = useMutation({
    mutationFn: async ({ title, content, tags }: { title: string; content: string; tags: string[] }) => {
      if (!noteId || !user) throw new Error("No note selected or user not found");

      const { data, error } = await supabase
        .from("notebook_notes")
        .update({ title, content, tags })
        .eq("id", noteId)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
    },
  });

  // Debounced update function with useCallback
  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (title: string, content: string, tags: string[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateNote.mutate({ title, content, tags });
        }, 1000); // 1 second delay
      };
    })(),
    [updateNote]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle); // Update local state immediately
    debouncedUpdate(newTitle, content, tags);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent); // Update local state immediately
    debouncedUpdate(title, newContent, tags);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
      debouncedUpdate(title, content, updatedTags);
      toast({
        title: "Tag added",
        description: `Added tag: ${newTag.trim()}`,
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    debouncedUpdate(title, content, updatedTags);
    toast({
        title: "Tag removed",
        description: `Removed tag: ${tagToRemove}`,
    });
  };

  if (!noteId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a note or create a new one to get started
      </div>
    );
  }

  if (isLoading) {
    return <div className="animate-pulse p-8 space-y-4">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-[500px] bg-muted rounded" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-background p-8 transition-all duration-200 ease-in-out">
      <div className="max-w-3xl mx-auto space-y-6">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="text-3xl font-semibold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 transition-colors duration-200"
        />
        
        <div className="flex flex-wrap gap-2 items-center min-h-[32px] opacity-70 hover:opacity-100 transition-opacity duration-200">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="gap-1 bg-secondary-hover hover:bg-secondary/10 transition-colors duration-200"
            >
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" 
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
          <div className="flex items-center gap-2 group">
            <PlusCircle className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add a tag..."
              className="border-none w-24 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 bg-transparent transition-colors duration-200"
            />
          </div>
        </div>

        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing..."
          className="min-h-[calc(100vh-300px)] resize-none border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 bg-transparent text-lg leading-relaxed transition-colors duration-200"
        />
      </div>
    </div>
  );
};