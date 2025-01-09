import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const RuleAdherence = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['ruleAdherence'],
    queryFn: async () => {
      console.log("Fetching rule adherence data...");
      
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('session_type', 'post')
        .not('outcome', 'eq', 'no_trades');

      if (error) {
        console.error("Error fetching entries:", error);
        throw error;
      }

      console.log("Fetched entries:", entries);

      const rulesFollowedStats = {
        wins: 0,
        losses: 0,
        total: 0,
      };

      const rulesNotFollowedStats = {
        wins: 0,
        losses: 0,
        total: 0,
      };

      entries?.forEach(entry => {
        const hasFollowedRules = entry.followed_rules && entry.followed_rules.length > 0;
        
        if (hasFollowedRules) {
          rulesFollowedStats.total++;
          if (entry.outcome === 'win') rulesFollowedStats.wins++;
          if (entry.outcome === 'loss') rulesFollowedStats.losses++;
        } else {
          rulesNotFollowedStats.total++;
          if (entry.outcome === 'win') rulesNotFollowedStats.wins++;
          if (entry.outcome === 'loss') rulesNotFollowedStats.losses++;
        }
      });

      console.log("Rules followed stats:", rulesFollowedStats);
      console.log("Rules not followed stats:", rulesNotFollowedStats);

      const calculatePercentage = (value: number, total: number) => 
        total > 0 ? Math.round((value / total) * 100) : 0;

      return [
        {
          name: "Rules Followed",
          wins: calculatePercentage(rulesFollowedStats.wins, rulesFollowedStats.total),
          losses: calculatePercentage(rulesFollowedStats.losses, rulesFollowedStats.total),
          total: rulesFollowedStats.total,
        },
        {
          name: "Rules Not Followed",
          wins: calculatePercentage(rulesNotFollowedStats.wins, rulesNotFollowedStats.total),
          losses: calculatePercentage(rulesNotFollowedStats.losses, rulesNotFollowedStats.total),
          total: rulesNotFollowedStats.total,
        },
      ];
    },
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

  // Default values if analytics data is incomplete
  const defaultStats = { wins: 0, losses: 0, total: 0 };
  const rulesFollowed = analytics[0] || { name: "Rules Followed", ...defaultStats };
  const rulesNotFollowed = analytics[1] || { name: "Rules Not Followed", ...defaultStats };
  
  // Require minimum 5 sessions in each category for meaningful insights
  const MINIMUM_SESSIONS = 5;
  const hasEnoughData = rulesFollowed.total >= MINIMUM_SESSIONS && 
                       rulesNotFollowed.total >= MINIMUM_SESSIONS;

  // Calculate insights only if we have valid data
  const winRateDifference = (rulesFollowed.wins || 0) - (rulesNotFollowed.wins || 0);

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Rule Adherence vs. Performance</h3>
        <p className="text-sm text-muted-foreground">
          Compare outcomes when trading rules are followed vs. not followed
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
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
          {hasEnoughData ? (
            <>
              <p>
                {winRateDifference > 0
                  ? `Following your trading rules resulted in a ${winRateDifference}% higher win rate.`
                  : `Your win rate was ${Math.abs(winRateDifference)}% lower when following rules - review your rule set.`}
              </p>
              <p>
                {rulesFollowed.wins > 50
                  ? "Your trading rules are effective when followed consistently."
                  : "Consider reviewing and adjusting your trading rules for better performance."}
              </p>
            </>
          ) : (
            <p>Add at least {MINIMUM_SESSIONS} trading sessions in each category (following rules and not following rules) to generate meaningful insights about your rule adherence.</p>
          )}
        </div>
      </div>
    </Card>
  );
};