import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalMap } from "./GlobalMap";

export const CommunitySection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join Our Global Trading Community
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect with traders worldwide who are mastering their psychology and improving their performance
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Global Reach</h3>
              <p className="text-muted-foreground">
                Join traders from over 50 countries sharing insights and experiences
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Active Community</h3>
              <p className="text-muted-foreground">
                Engage with thousands of traders focused on psychological growth
              </p>
            </div>
          </div>

          <Button 
            onClick={() => navigate("/login")} 
            size="lg"
            className="w-full md:w-auto"
          >
            Join the Community
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <GlobalMap />
      </div>
    </section>
  );
};