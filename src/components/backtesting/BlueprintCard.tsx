import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Smile, ThumbsUp, Heart, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BlueprintCardProps {
  name: string;
  instrument: string;
  winRate?: number;
  id: string;
  emoji?: string;
}

const emojis = [
  { icon: Smile, label: "Smile", color: "#FFD93D" },
  { icon: ThumbsUp, label: "Thumbs Up", color: "#4CAF50" },
  { icon: Heart, label: "Heart", color: "#FF6B6B" },
  { icon: Star, label: "Star", color: "#FFD700" },
  { icon: Trophy, label: "Trophy", color: "#FFA726" },
];

export function BlueprintCard({ name, instrument, winRate = 0, id, emoji: initialEmoji }: BlueprintCardProps) {
  const navigate = useNavigate();
  const [selectedEmoji, setSelectedEmoji] = useState(initialEmoji || "Smile");

  const handleEmojiSelect = async (emojiLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmoji(emojiLabel);
    
    const { error } = await supabase
      .from("trading_blueprints")
      .update({ emoji: emojiLabel })
      .eq("id", id);

    if (error) {
      console.error("Error updating emoji:", error);
    }
  };

  const EmojiIcon = emojis.find(e => e.label === selectedEmoji)?.icon || Smile;
  const emojiColor = emojis.find(e => e.label === selectedEmoji)?.color || "#FFD93D";

  return (
    <Card 
      className="bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 cursor-pointer relative hover:shadow-lg hover:-translate-y-1 animate-fade-in border-primary/10"
      onClick={() => navigate(`/blueprint/${id}`)}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {name}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-primary/10 transition-colors"
            >
              <EmojiIcon className="h-5 w-5" style={{ color: emojiColor }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
            {emojis.map(({ icon: Icon, label, color }) => (
              <DropdownMenuItem
                key={label}
                onClick={(e) => handleEmojiSelect(label, e)}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
              >
                <Icon className="mr-2 h-4 w-4" style={{ color }} />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 transition-colors border-primary/20">
            {instrument}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Win Rate: {winRate}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}