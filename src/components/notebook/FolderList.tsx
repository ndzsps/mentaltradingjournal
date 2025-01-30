import { Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
  isLoading: boolean;
  selectedFolderId: string | null;
  onSelectFolder: (id: string) => void;
  onDrop: (noteId: string, folderId: string) => void;
}

export const FolderList = ({ 
  folders, 
  isLoading, 
  selectedFolderId, 
  onSelectFolder,
  onDrop 
}: FolderListProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createFolder = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("No user found");
      
      const { data, error } = await supabase
        .from("notebook_folders")
        .insert([{ 
          name: newFolderName,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setIsCreating(false);
      setNewFolderName("");
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-muted");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-muted");
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-muted");
    const noteId = e.dataTransfer.getData("noteId");
    if (noteId) {
      onDrop(noteId, folderId);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 bg-muted/50 rounded-lg" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsCreating(true)}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>
      
      {isCreating && (
        <div className="space-y-2">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="h-8"
            autoFocus
          />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => createFolder.mutate()}
              disabled={!newFolderName.trim()}
            >
              Create
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsCreating(false);
                setNewFolderName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-1">
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectFolder(folder.id)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder.id)}
            >
              <Folder className="mr-2 h-4 w-4" />
              {folder.name}
            </Button>
          ))}
          {folders.length === 0 && !isCreating && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No folders yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};