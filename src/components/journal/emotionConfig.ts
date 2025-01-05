import { Smile, Meh, Frown, ThumbsUp, ThumbsDown, MinusCircle } from "lucide-react";
import { Emotion, TradingOutcome } from "./types";

export const emotions: Emotion[] = [
  { 
    icon: Smile, 
    label: "Positive", 
    value: "positive",
    details: [
      "Confident",
      "Motivated",
      "Focused",
      "Energetic",
      "Grateful",
      "Optimistic"
    ]
  },
  { 
    icon: Meh, 
    label: "Neutral", 
    value: "neutral",
    details: [
      "Calm",
      "Reserved",
      "Observant",
      "Patient",
      "Balanced",
      "Steady"
    ]
  },
  { 
    icon: Frown, 
    label: "Negative", 
    value: "negative",
    details: [
      "Losing Streak",
      "Family pressures",
      "Career pressure",
      "Stressed from work",
      "Conflicted with a loved one or friend",
      "Hungover",
      "Market Volatility",
      "Technical Issues",
      "Health Issues"
    ]
  },
];

export const tradingOutcome: TradingOutcome[] = [
  { icon: ThumbsUp, label: "Win", value: "win" },
  { icon: ThumbsDown, label: "Loss", value: "loss" },
  { icon: MinusCircle, label: "No Trades", value: "no_trades" },
];