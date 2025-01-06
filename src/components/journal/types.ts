import { LucideIcon } from "lucide-react";

export type Emotion = {
  icon: LucideIcon;
  label: string;
  value: string;
  details: string[];
};

export type TradingOutcome = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export type MistakeCategory = {
  label: string;
  value: string;
};

export type TradingRule = {
  label: string;
  value: string;
};