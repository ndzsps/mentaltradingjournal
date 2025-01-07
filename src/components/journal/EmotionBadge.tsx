import { Badge } from "@/components/ui/badge";

interface EmotionBadgeProps {
  emotion: string;
  detail: string;
}

export const EmotionBadge = ({ emotion, detail }: EmotionBadgeProps) => {
  const getEmotionStyles = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'positive':
        return 'border-green-500/50 text-green-600 bg-green-500/5 hover:bg-green-500/10';
      case 'neutral':
        return 'border-yellow-500/50 text-yellow-600 bg-yellow-500/5 hover:bg-yellow-500/10';
      case 'negative':
        return 'border-red-500/50 text-red-500 bg-red-500/5 hover:bg-red-500/10';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${getEmotionStyles(emotion)}`}
    >
      {emotion.charAt(0).toUpperCase() + emotion.slice(1)} - {detail.charAt(0).toUpperCase() + detail.slice(1)}
    </Badge>
  );
};