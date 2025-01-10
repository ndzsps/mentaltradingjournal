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
  { icon: Smile, label: "Smile", color: "#F2FCE2" },
  { icon: ThumbsUp, label: "Thumbs Up", color: "#D3E4FD" },
  { icon: Heart, label: "Heart", color: "#FFDEE2" },
  { icon: Star, label: "Star", color: "#FEF7CD" },
  { icon: Trophy, label: "Trophy", color: "#FEC6A1" },
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

  const selectedEmojiConfig = emojis.find(e => e.label === selectedEmoji);
  const EmojiIcon = selectedEmojiConfig?.icon || Smile;

  return (
    <Card 
      className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer relative"
      onClick={() => navigate(`/blueprint/${id}`)}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <EmojiIcon 
                className="h-5 w-5" 
                style={{ color: selectedEmojiConfig?.color }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm">
            {emojis.map(({ icon: Icon, label, color }) => (
              <DropdownMenuItem
                key={label}
                onClick={(e) => handleEmojiSelect(label, e)}
                className="cursor-pointer hover:bg-accent/10"
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
          <Badge variant="outline" className="bg-primary/10">
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