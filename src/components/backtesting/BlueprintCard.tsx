import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlueprintCardProps {
  name: string;
  instrument: string;
  winRate?: number;
}

export function BlueprintCard({ name, instrument, winRate = 0 }: BlueprintCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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