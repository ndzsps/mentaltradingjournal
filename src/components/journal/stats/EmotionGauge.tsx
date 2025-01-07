import React from 'react';

interface EmotionGaugeProps {
  score: number;
}

export const EmotionGauge = ({ score }: EmotionGaugeProps) => {
  // Calculate the rotation angle based on the score (0-100)
  const rotation = -90 + (score / 100) * 180;
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-t-full border-4 border-border/20" />
        
        {/* Background gradient */}
        <div 
          className="absolute inset-0 rounded-t-full overflow-hidden"
          style={{
            background: `conic-gradient(
              from 180deg at 50% 100%,
              #dc2626 0deg,      /* Deep red */
              #dc2626 45deg,     /* Red section */
              #f59e0b 45deg,     /* Orange/yellow transition */
              #fbbf24 90deg,     /* Yellow section */
              #fbbf24 120deg,    /* Hold yellow */
              #16a34a 120deg,    /* Transition to green */
              #15803d 180deg     /* Deep green */
            )`,
            clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)',
            opacity: 0.9
          }}
        />

        {/* Tick marks */}
        <div className="absolute inset-0">
          {[0, 45, 90, 135, 180].map((deg) => (
            <div
              key={deg}
              className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-border/60"
              style={{
                transform: `translateX(-50%) rotate(${deg - 90}deg)`,
                transformOrigin: 'bottom'
              }}
            />
          ))}
        </div>

        {/* Indicator needle with shadow */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-11 origin-bottom transition-transform duration-700 shadow-lg"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            background: 'linear-gradient(to bottom, #1a1a1a, #000000)',
          }}
        />

        {/* Center point with metallic effect */}
        <div 
          className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full shadow-lg"
          style={{
            transform: 'translate(-50%, 50%)',
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #d1d5db)',
            border: '2px solid #1a1a1a'
          }}
        />
      </div>

      {/* Score display */}
      <div className="flex flex-col">
        <div className="text-2xl font-bold">
          {score.toFixed(0)}%
        </div>
        <div className="text-sm text-muted-foreground">
          Positive Emotions
        </div>
      </div>
    </div>
  );
};