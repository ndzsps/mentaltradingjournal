import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Brain, Target } from "lucide-react";
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

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Master Your Trading Psychology
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track, analyze, and improve your trading decisions with our advanced
            emotional intelligence platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/login")} size="lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Data-Driven Reports Section */}
      <section className="container mx-auto px-4 py-12 bg-accent/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Data-Driven Reports
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Gain Key Insights Into Your Trading Psychology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden">
            <CardHeader className="space-y-4">
              <Brain className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-xl">Emotional Intelligence</CardTitle>
                <CardDescription className="mt-2">
                  Track how your emotions correlate with trading performance and identify patterns that lead to better decision-making.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] p-4">
                <EmotionalTendencies />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="space-y-4">
              <BarChart2 className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-xl">Data Analytics</CardTitle>
                <CardDescription className="mt-2">
                  Analyze performance across different currency pairs and understand which markets suit your trading style best.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] p-4">
                <AssetPairPerformance />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="space-y-4">
              <Target className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-xl">Continuous Improvement</CardTitle>
                <CardDescription className="mt-2">
                  Identify common mistakes and their impact on your trading results to develop better strategies over time.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] p-4">
                <MistakeAnalysis />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;