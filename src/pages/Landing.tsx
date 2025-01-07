import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Brain,
  LineChart,
  Activity,
  Gauge,
  Heart,
  Scale,
  Globe,
  Users
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Landing = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const analyticsTools = [
    {
      title: "Emotional Intelligence Mastery",
      description: "Transform emotions from trading obstacles into strategic advantages",
      icon: Brain,
      features: [
        "Identify emotional triggers affecting trades",
        "Track mood-performance correlation",
        "Build emotional resilience"
      ],
      gradient: "from-violet-500/20 to-purple-500/20"
    },
    {
      title: "Psychological Pattern Recognition",
      description: "Understand and improve your trading psychology patterns",
      icon: Heart,
      features: [
        "Behavioral pattern analysis",
        "Decision-making insights",
        "Stress response tracking"
      ],
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
      title: "Mental Balance Metrics",
      description: "Maintain psychological equilibrium during market volatility",
      icon: Scale,
      features: [
        "Stress level monitoring",
        "Recovery time analysis",
        "Mindset optimization"
      ],
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Performance Analytics",
      description: "Comprehensive analysis of your trading decisions",
      icon: LineChart,
      features: [
        "Win/loss pattern analysis",
        "Risk management tracking",
        "Performance metrics"
      ],
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Risk Psychology Profile",
      description: "Understand your risk tolerance and decision patterns",
      icon: Gauge,
      features: [
        "Risk behavior analysis",
        "Emotional risk assessment",
        "Decision confidence tracking"
      ],
      gradient: "from-orange-500/20 to-amber-500/20"
    },
    {
      title: "Behavioral Pattern Analysis",
      description: "Identify and optimize your trading behavior patterns",
      icon: Activity,
      features: [
        "Trading habit analysis",
        "Psychological biases detection",
        "Behavior optimization tips"
      ],
      gradient: "from-indigo-500/20 to-blue-500/20"
    }
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your Mapbox token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [30, 15],
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Disable scroll zoom for smoother experience
    map.current.scrollZoom.disable();

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    // Rotation animation
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    spinGlobe();

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
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
      <section className="container mx-auto px-4 py-16 bg-accent/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trading Psychology Analytics
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your trading mindset with our comprehensive suite of psychological analysis tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsTools.map((tool, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none bg-gradient-to-br ${tool.gradient} h-full`}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-background/80 backdrop-blur-sm">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="flex items-center space-x-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            onClick={() => navigate("/login")} 
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            Start Your Psychology Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Global Community Section */}
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

          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <div ref={mapContainer} className="absolute inset-0" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
