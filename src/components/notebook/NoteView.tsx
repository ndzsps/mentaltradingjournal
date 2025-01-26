import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface NoteViewProps {
  noteId: string | null;
}

export const NoteView = ({ noteId }: NoteViewProps) => {
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

  if (!noteId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a note to view its contents
      </div>
    );
  }

  if (isLoading) {
    return <div className="animate-pulse h-[600px] bg-muted rounded-lg" />;
  }

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Note not found
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{note.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};