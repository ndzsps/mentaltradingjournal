import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Note {
  id: string;
  title: string;
  content: string;
}

export const NotesList = ({ folderId }: { folderId: string | null }) => {
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes", folderId],
    queryFn: async () => {
      if (!folderId) return [];
      const { data, error } = await supabase
        .from("notebook_notes")
        .select("*")
        .eq("folder_id", folderId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!folderId,
  });

  const createNote = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!folderId) throw new Error("No folder selected");
      const { data, error } = await supabase
        .from("notebook_notes")
        .insert([{ folder_id: folderId, title, content }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
      setNewNoteTitle("");
      setNewNoteContent("");
      toast({
        title: "Success",
        description: "Note created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    },
  });

  const handleCreateNote = () => {
    if (!newNoteTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note title",
        variant: "destructive",
      });
      return;
    }
    createNote.mutate({ title: newNoteTitle, content: newNoteContent });
  };

  if (!folderId) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Select a folder to view and create notes
      </div>
    );
  }

  if (isLoading) {
    return <div className="animate-pulse h-[400px] bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Input
          placeholder="Note title"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
        <Textarea
          placeholder="Note content"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          rows={4}
        />
        <Button
          onClick={handleCreateNote}
          disabled={createNote.isPending}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {notes?.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
          {notes?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No notes in this folder yet. Create one above!
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};