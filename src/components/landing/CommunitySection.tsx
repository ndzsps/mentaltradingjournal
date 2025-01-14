import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NetworkNode = ({ 
  className = "", 
  delay = "0", 
  personIndex = 1 
}: { 
  className?: string; 
  delay?: string; 
  personIndex?: number;
}) => (
  <div 
    className={`absolute w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
    animate-pulse ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="relative w-full h-full overflow-hidden rounded-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
      <img 
        src={`/lovable-uploads/91672ac9-abaf-4516-be02-da4356804468.png`} 
        alt="Community member"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  </div>
);

const NetworkLine = ({ 
  startX, 
  startY, 
  endX, 
  endY 
}: { 
  startX: number; 
  startY: number; 
  endX: number; 
  endY: number;
}) => {
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

  return (
    <div 
      className="absolute h-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"
      style={{
        width: `${length}px`,
        left: `${startX}px`,
        top: `${startY}px`,
        transformOrigin: '0 0',
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};

export const CommunitySection = () => {
  const navigate = useNavigate();
  
  const nodePositions = [
    { x: 50, y: 50 },
    { x: 200, y: 80 },
    { x: 350, y: 60 },
    { x: 100, y: 200 },
    { x: 250, y: 180 },
    { x: 400, y: 220 },
    { x: 150, y: 300 },
    { x: 300, y: 280 },
    { x: 450, y: 320 },
  ];

  const connections = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
    [3, 4], [4, 5], [3, 6], [4, 7], [5, 8],
    [6, 7], [7, 8], [1, 3], [2, 4], [4, 6]
  ];
  
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

        <div className="relative h-[400px] w-full rounded-xl overflow-hidden bg-[#1A1F2C]/50 backdrop-blur-sm border border-white/10">
          <div className="absolute inset-0">
            {/* Network Lines */}
            {connections.map(([startIdx, endIdx], i) => (
              <NetworkLine
                key={`line-${i}`}
                startX={nodePositions[startIdx].x}
                startY={nodePositions[startIdx].y}
                endX={nodePositions[endIdx].x}
                endY={nodePositions[endIdx].y}
              />
            ))}

            {/* Network Nodes */}
            {nodePositions.map((pos, i) => (
              <NetworkNode
                key={`node-${i}`}
                className={`translate-x-[${pos.x}px] translate-y-[${pos.y}px]`}
                delay={`${i * 0.2}s`}
                personIndex={i + 1}
              />
            ))}

            {/* Center Node - Mental Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 animate-pulse">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-accent/40" />
              <div className="absolute inset-0 flex items-center justify-center text-primary-light font-bold text-2xl">
                M
              </div>
            </div>

            {/* Animated Particles */}
            <div className="absolute inset-0">
              <div className="absolute w-2 h-2 rounded-full bg-primary/50 animate-ping" style={{ top: '20%', left: '30%' }} />
              <div className="absolute w-2 h-2 rounded-full bg-accent/50 animate-ping" style={{ top: '70%', right: '25%', animationDelay: '1s' }} />
              <div className="absolute w-2 h-2 rounded-full bg-primary-light/50 animate-ping" style={{ top: '40%', right: '40%', animationDelay: '2s' }} />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#1A1F2C]/50" />
          </div>
        </div>
      </div>
    </section>
  );
};