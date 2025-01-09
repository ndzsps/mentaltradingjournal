import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const BlueprintDashboard = () => {
  const { data: blueprints, isLoading, error } = useQuery({
    queryKey: ["blueprints"],
    queryFn: async () => {
      console.log("Fetching blueprints...");
      const { data, error } = await supabase
        .from("trading_blueprints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blueprints:", error);
        throw error;
      }
      
      console.log("Fetched blueprints:", data);
      return data;
    },
  });

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p>Error loading blueprints. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-primary/10 rounded" />
          <div className="h-96 bg-primary/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trading Blueprints</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Blueprint
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Trades</TableHead>
              <TableHead className="text-right">Net P&L</TableHead>
              <TableHead className="text-right">Win Rate</TableHead>
              <TableHead className="text-right">Missed Trades</TableHead>
              <TableHead className="text-right">Expectancy</TableHead>
              <TableHead className="text-right">Average Loser</TableHead>
              <TableHead className="text-right">Average Winner</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blueprints?.map((blueprint) => (
              <TableRow key={blueprint.id}>
                <TableCell className="font-medium">{blueprint.name}</TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">$0.00</TableCell>
                <TableCell className="text-right">0.00%</TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">$0.00</TableCell>
                <TableCell className="text-right">$0.00</TableCell>
                <TableCell className="text-right">$0.00</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {(!blueprints || blueprints.length === 0) && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No trading blueprints found. Create your first one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};