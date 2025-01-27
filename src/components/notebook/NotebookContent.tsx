import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PenLine, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotesList } from "./NotesList";
import { NoteView } from "./NoteView";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const NotebookContent = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("notebook_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createNote = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("notebook_notes")
        .insert([{ 
          title: "Untitled Note",
          content: "",
          user_id: user.id,
          folder_id: null // We'll implement folders later
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNoteId(data.id);
      toast({
        title: "Success",
        description: "New note created",
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

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => createNote.mutate()}
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <NotesList 
          notes={notes || []} 
          isLoading={isLoading}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
        />
      </div>
      <div className="flex-1">
        <NoteView noteId={selectedNoteId} />
      </div>
    </div>
  );
};