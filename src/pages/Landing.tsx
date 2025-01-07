import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Brain, Target, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmotionalTendencies } from "@/components/analytics/EmotionalTendencies";
import { AssetPairPerformance } from "@/components/analytics/AssetPairPerformance";
import { MistakeAnalysis } from "@/components/analytics/MistakeAnalysis";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Master Your Trading Psychology
        </h1>
        <p className="mx-auto mb-8 max-w-[700px] text-lg text-muted-foreground">
          Transform your trading journey with data-driven insights and emotional intelligence tracking
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto"
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* Data-Driven Reports Section */}
      <section className="bg-accent/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl">
              Data-Driven Reports
            </h2>
            <p className="mx-auto max-w-[600px] text-lg text-muted-foreground">
              Gain key insights into your trading psychology through comprehensive analytics
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Example 1: Emotional Impact */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Emotional Impact Analysis
                </CardTitle>
                <CardDescription>
                  Track how emotions influence your trading decisions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <EmotionalTendencies />
              </CardContent>
            </Card>

            {/* Example 2: Performance Analysis */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Performance Breakdown
                </CardTitle>
                <CardDescription>
                  Analyze performance across different currency pairs
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AssetPairPerformance />
              </CardContent>
            </Card>

            {/* Example 3: Pattern Recognition */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Pattern Recognition
                </CardTitle>
                <CardDescription>
                  Identify and learn from recurring trading patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <MistakeAnalysis />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Emotional Intelligence
              </CardTitle>
              <CardDescription>
                Track and understand how your emotions impact trading decisions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Performance Tracking
              </CardTitle>
              <CardDescription>
                Monitor your progress and identify areas for improvement
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Data-Driven Insights
              </CardTitle>
              <CardDescription>
                Make informed decisions based on comprehensive analytics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};