import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface NoteViewProps {
  noteId: string | null;
}

export const NoteView = ({ noteId }: NoteViewProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
    }
  }, [note]);

  const updateNote = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!noteId || !user) throw new Error("No note selected or user not found");

      const { data, error } = await supabase
        .from("notebook_notes")
        .update({ title, content })
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
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateNote.mutate({ title: e.target.value, content });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    updateNote.mutate({ title, content: e.target.value });
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
    <div className="p-8 space-y-4">
      <Input
        value={title}
        onChange={handleTitleChange}
        placeholder="Note title"
        className="text-2xl font-semibold border-none px-0 focus-visible:ring-0"
      />
      <Textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Start writing..."
        className="min-h-[500px] resize-none border-none px-0 focus-visible:ring-0"
      />
    </div>
  );
};