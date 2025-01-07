import React from 'react';

interface EmotionGaugeProps {
  score: number;
}

export const EmotionGauge = ({ score }: EmotionGaugeProps) => {
  // Calculate the rotation angle based on the score (0-100)
  // Since we want the needle to start from the bottom (180 degrees)
  // and rotate counter-clockwise to 0 degrees based on the score
  const rotation = 180 - (score / 100) * 180;
  
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
                transform: `translateX(-50%) rotate(${deg}deg)`,
                transformOrigin: 'bottom'
              }}
            />
          ))}
        </div>

        {/* Center point */}
        <div 
          className="absolute bottom-0 left-1/2 w-3 h-3 -translate-x-1/2 translate-y-1/2 bg-black rounded-full z-20"
        />

        {/* Indicator needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-11 bg-black origin-bottom transition-transform duration-700 z-10"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
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