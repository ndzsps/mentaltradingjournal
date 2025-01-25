import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
  isLoading: boolean;
  selectedFolderId: string | null;
  onSelectFolder: (id: string) => void;
}

export const FolderList = ({ folders, isLoading, selectedFolderId, onSelectFolder }: FolderListProps) => {
  if (isLoading) {
    return <div className="animate-pulse h-[400px] bg-muted rounded-lg" />;
  }

  return (
    <ScrollArea className="h-[400px] rounded-lg border p-4">
      <div className="space-y-2">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={selectedFolderId === folder.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectFolder(folder.id)}
          >
            <Folder className="mr-2 h-4 w-4" />
            {folder.name}
          </Button>
        ))}
        {folders.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No folders yet. Create one to get started!
          </p>
        )}
      </div>
    </ScrollArea>
  );
};