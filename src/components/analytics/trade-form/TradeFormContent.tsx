import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GeneralSection } from "./GeneralSection";
import { TradeEntrySection } from "./TradeEntrySection";
import { TradeExitSection } from "./TradeExitSection";
import { TradeScreenshotsSection } from "./TradeScreenshotsSection";
import { useState } from "react";
import { Trade } from "@/types/trade";

const tradeFormSchema = z.object({
  instrument: z.string().min(1, "Instrument is required"),
  direction: z.enum(["buy", "sell"]),
  quantity: z.string().min(1, "Quantity is required"),
  entryPrice: z.string().min(1, "Entry price is required"),
  exitPrice: z.string().min(1, "Exit price is required"),
  stopLoss: z.string().min(1, "Stop loss is required"),
  takeProfit: z.string(),
  entryDate: z.string().min(1, "Entry date is required"),
  exitDate: z.string().min(1, "Exit date is required"),
  setup: z.string(),
  fees: z.string(),
  pnl: z.string(),
});

interface TradeFormContentProps {
  onSubmit: (data: Trade) => void;
}

export const TradeFormContent = ({ onSubmit }: TradeFormContentProps) => {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [url, setUrl] = useState("");

  const form = useForm<z.infer<typeof tradeFormSchema>>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      direction: "buy",
      quantity: "",
      entryPrice: "",
      exitPrice: "",
      stopLoss: "",
      takeProfit: "",
      entryDate: "",
      exitDate: "",
      setup: "",
      fees: "",
      pnl: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof tradeFormSchema>) => {
    onSubmit({
      ...values,
      id: crypto.randomUUID(),
      screenshots,
      url: url.trim() || undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <GeneralSection form={form} />
        <TradeEntrySection form={form} />
        <TradeExitSection form={form} />
        <TradeScreenshotsSection
          screenshots={screenshots}
          setScreenshots={setScreenshots}
          url={url}
          setUrl={setUrl}
        />
        <Button type="submit" className="w-full">Submit Trade</Button>
      </form>
    </Form>
  );
};