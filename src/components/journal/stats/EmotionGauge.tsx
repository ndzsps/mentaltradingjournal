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
        {/* Main gauge background */}
        <div 
          className="absolute inset-0 rounded-t-full overflow-hidden border-2 border-border"
          style={{
            background: `conic-gradient(
              from 180deg at 50% 100%,
              #ef4444 0deg,      /* Red */
              #ef4444 60deg,     /* Hold red */
              #fbbf24 60deg,     /* Transition to yellow */
              #fbbf24 120deg,    /* Hold yellow */
              #22c55e 120deg,    /* Transition to green */
              #22c55e 180deg     /* Hold green */
            )`,
            clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)',
          }}
        />

        {/* Simple tick marks */}
        <div className="absolute inset-0">
          {[0, 45, 90, 135, 180].map((deg) => (
            <div
              key={deg}
              className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-white/40"
              style={{
                transform: `translateX(-50%) rotate(${deg - 90}deg)`,
                transformOrigin: 'bottom'
              }}
            />
          ))}
        </div>

        {/* Clean black needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-11 bg-black origin-bottom transition-transform duration-700"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
          }}
        />

        {/* Simple center point */}
        <div 
          className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-black"
          style={{
            transform: 'translate(-50%, 50%)',
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