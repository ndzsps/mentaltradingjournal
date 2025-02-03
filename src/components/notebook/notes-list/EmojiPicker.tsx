import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface EmojiPickerProps {
  noteId: string;
  onClose: () => void;
}

// Common emoji categories
const emojis = {
  recent: ["😊", "🤔", "👍", "🎉", "❤️", "🔥", "⭐", "📝", "💡", "✨"],
  emotions: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  objects: ["📝", "📚", "💼", "💡", "⭐", "🌟", "✨", "💫", "🔥", "❤️", "📌", "📍", "🎯", "🎨", "🖼️", "📊"],
  symbols: ["✅", "❌", "⭕", "❗", "❓", "⚡", "💯", "🔄", "🔍", "➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "🔸"],
};

export const EmojiPicker = ({ noteId, onClose }: EmojiPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleEmojiSelect = (emoji: string) => {
    // TODO: Implement emoji selection logic
    console.log(`Selected emoji ${emoji} for note ${noteId}`);
    onClose();
  };

  const filteredEmojis = searchTerm
    ? Object.values(emojis).flat().filter(emoji => 
        emoji.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <Input
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <ScrollArea className="h-[300px] pr-4">
            {filteredEmojis ? (
              <div className="grid grid-cols-8 gap-2">
                {filteredEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="p-2 text-xl hover:bg-secondary/20 rounded-md transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(emojis).map(([category, categoryEmojis]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium capitalize mb-2">{category}</h3>
                    <div className="grid grid-cols-8 gap-2">
                      {categoryEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="p-2 text-xl hover:bg-secondary/20 rounded-md transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};