import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { NoteTitle } from "./NoteTitle";
import { NoteTags } from "./NoteTags";
import { NoteContent } from "./NoteContent";
import { Separator } from "@/components/ui/separator";

interface NoteViewProps {
  noteId: string | null;
}

export const NoteView = ({ noteId }: NoteViewProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLocalUpdate, setIsLocalUpdate] = useState(false);
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
    if (note && !isLocalUpdate) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
    }
  }, [note, isLocalUpdate]);

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
      setIsLocalUpdate(false);
    },
  });

  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (title: string, content: string, tags: string[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateNote.mutate({ title, content, tags });
        }, 1000);
      };
    })(),
    [updateNote]
  );

  const handleTitleChange = (newTitle: string) => {
    setIsLocalUpdate(true);
    setTitle(newTitle);
    debouncedUpdate(newTitle, content, tags);
  };

  const handleContentChange = (newContent: string) => {
    setIsLocalUpdate(true);
    setContent(newContent);
    debouncedUpdate(title, newContent, tags);
  };

  const handleAddTag = (newTag: string) => {
    setIsLocalUpdate(true);
    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    debouncedUpdate(title, content, updatedTags);
    toast({
      title: "Tag added",
      description: `Added tag: ${newTag}`,
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setIsLocalUpdate(true);
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
      <div className="h-8 bg-muted/50 rounded w-1/3" />
      <div className="h-4 bg-muted/50 rounded w-1/4" />
      <div className="h-[500px] bg-muted/50 rounded" />
    </div>;
  }

  return (
    <div className="h-full bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <NoteTitle title={title} onTitleChange={handleTitleChange} />
        <NoteTags tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
        <Separator className="my-4" />
        <NoteContent content={content} onContentChange={handleContentChange} />
      </div>
    </div>
  );
};