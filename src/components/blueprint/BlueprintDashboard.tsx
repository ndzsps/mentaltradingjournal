import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BlueprintDashboard = () => {
  const { data: blueprints, isLoading } = useQuery({
    queryKey: ["blueprints"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_blueprints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trading Blueprints</h1>
        <Button>
          <Plus className="mr-2" />
          Create Blueprint
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blueprints?.map((blueprint) => (
          <Card key={blueprint.id}>
            <CardHeader>
              <CardTitle>{blueprint.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{blueprint.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};