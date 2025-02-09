import { Folder, Plus, MoreVertical, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
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

  const renameFolder = useMutation({
    mutationFn: async ({ folderId, newName }: { folderId: string; newName: string }) => {
      if (!user) throw new Error("No user found");
      
      const { error } = await supabase
        .from("notebook_folders")
        .update({ name: newName })
        .eq("id", folderId)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setEditingFolderId(null);
      setEditingFolderName("");
      toast({
        title: "Success",
        description: "Folder renamed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to rename folder",
        variant: "destructive",
      });
    },
  });

  const deleteFolder = useMutation({
    mutationFn: async (folderId: string) => {
      if (!user) throw new Error("No user found");
      
      const { error } = await supabase
        .from("notebook_folders")
        .delete()
        .eq("id", folderId)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete folder",
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

  const handleFolderClick = (e: React.MouseEvent, folderId: string) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.folder-actions')) {
      onSelectFolder(folderId);
    }
  };

  const handleStartRename = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const handleRenameSubmit = (folderId: string) => {
    if (editingFolderName.trim()) {
      renameFolder.mutate({ folderId, newName: editingFolderName });
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
            className="h-8 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 bg-muted/50"
            autoFocus
          />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              className="w-full h-8"
              onClick={() => createFolder.mutate()}
              disabled={!newFolderName.trim()}
            >
              Create
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="w-full h-8"
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
            <div
              key={folder.id}
              className="group relative"
            >
              {editingFolderId === folder.id ? (
                <div className="flex gap-2 px-2">
                  <Input
                    value={editingFolderName}
                    onChange={(e) => setEditingFolderName(e.target.value)}
                    className="h-8 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 bg-muted/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameSubmit(folder.id);
                      } else if (e.key === 'Escape') {
                        setEditingFolderId(null);
                        setEditingFolderName("");
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    variant="secondary"
                    className="h-8 px-3"
                    onClick={() => handleRenameSubmit(folder.id)}
                    disabled={!editingFolderName.trim()}
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3"
                    onClick={() => {
                      setEditingFolderId(null);
                      setEditingFolderName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={(e) => handleFolderClick(e, folder.id)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, folder.id)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {folder.name}
                  </Button>
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity folder-actions">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem 
                          onClick={() => handleStartRename(folder)}
                          className="gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteFolder.mutate(folder.id)}
                          className="text-destructive focus:text-destructive gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
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
