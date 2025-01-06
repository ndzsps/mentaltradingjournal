import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";
import { AddTradeDialog } from "./AddTradeDialog";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

export const RuleAdherence = () => {
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });
  
  if (isLoading || !analytics) {
    return (
      <Card className="p-4 md:p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/10 rounded w-3/4"></div>
          <div className="h-[250px] md:h-[300px] bg-accent/10 rounded"></div>
        </div>
      </Card>
    );
  }
  
  const data = [
    {
      name: "Rules Followed",
      wins: 80,
      losses: 20,
    },
    {
      name: "Rules Broken",
      wins: 20,
      losses: 80,
    },
  ];

  const handleTradeSubmit = (tradeData: any, isEdit: boolean) => {
    // Here you would typically handle the trade data, e.g., save it to a database
    console.log("Trade submitted:", tradeData);
    toast.success(isEdit ? "Trade updated successfully!" : "Trade added successfully!");
    setSelectedTrade(null);
  };

  const handleEditTrade = (trade: any) => {
    setSelectedTrade(trade);
    setShowAddTradeDialog(true);
  };

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-bold">Rule Adherence vs. Performance</h3>
          <p className="text-sm text-muted-foreground">
            Compare outcomes when trading rules are followed vs. broken
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleEditTrade({
              id: '1', // Example trade data
              direction: 'buy',
              instrument: 'AAPL',
              entryPrice: '150.00'
            })}
            className="flex items-center gap-2"
            size="sm"
          >
            <Pencil className="w-4 h-4" />
            Edit Last Trade
          </Button>
          <Button
            onClick={() => setShowAddTradeDialog(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Add Trade
          </Button>
        </div>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="wins" fill="#6E59A5" name="Wins %" />
            <Bar dataKey="losses" fill="#FEC6A1" name="Losses %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>Following your trading rules resulted in an 80% win rate, compared to 20% when rules were not followed.</p>
          <p>Skipping your stop-loss rules led to average losses of 3x larger than planned.</p>
        </div>
      </div>

      <AddTradeDialog
        open={showAddTradeDialog}
        onOpenChange={setShowAddTradeDialog}
        onSubmit={handleTradeSubmit}
        editTrade={selectedTrade}
      />
    </Card>
  );
};