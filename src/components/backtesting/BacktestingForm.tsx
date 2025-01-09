import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DateRange } from "react-day-picker";

type BacktestFormData = {
  name: string;
  description: string;
  playbook_id: string;
  market_type: string;
  symbol: string;
  start_balance: number;
  dateRange: DateRange | undefined;
  leverage: number;
};

export const BacktestingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const form = useForm<BacktestFormData>({
    defaultValues: {
      leverage: 1.1,
      dateRange: undefined,
    },
  });

  const { data: playbooks } = useQuery({
    queryKey: ["playbooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_blueprints")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: BacktestFormData) => {
    if (!data.dateRange?.from || !data.dateRange?.to) {
      return;
    }

    try {
      const { error } = await supabase.from("backtesting_sessions").insert({
        ...data,
        user_id: user?.id,
        start_date: data.dateRange.from.toISOString(),
        end_date: data.dateRange.to.toISOString(),
      });

      if (error) throw error;
      navigate("/backtesting");
    } catch (error) {
      console.error("Error creating backtesting session:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create new session</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session name*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="playbook_id"
              render={({ field }) => (
                <FormItem className="flex-1 mr-4">
                  <FormLabel>Connect to trading blueprint</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a playbook" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {playbooks?.map((playbook) => (
                        <SelectItem key={playbook.id} value={playbook.id}>
                          {playbook.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-8"
              onClick={() => navigate("/blueprint")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create new playbook
            </Button>
          </div>

          <FormField
            control={form.control}
            name="market_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <div className="flex gap-4">
                  {["Forex", "Stocks", "Crypto", "Futures"].map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={field.value === type ? "default" : "outline"}
                      onClick={() => field.onChange(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symbol</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EURUSD">EUR/USD</SelectItem>
                    <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                    <SelectItem value="USDJPY">USD/JPY</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start balance*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input {...field} className="pl-6" type="number" step="0.01" />
                    </div>
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Leverage is {form.getValues("leverage")}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date range*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Select date range</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-muted-foreground">
                    Start time is 12 am US/Eastern
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-start gap-4">
            <Button type="submit">Create session</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};