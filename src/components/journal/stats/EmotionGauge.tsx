import React from 'react';

interface EmotionGaugeProps {
  score: number;
}

export const EmotionGauge = ({ score }: EmotionGaugeProps) => {
  // Calculate the rotation angle based on the score (0-100)
  const rotation = -90 + (score / 100) * 180;
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-40 h-20">
        {/* Main semicircle background */}
        <div 
          className="absolute inset-0 rounded-t-full overflow-hidden"
          style={{
            background: `conic-gradient(
              from 180deg at 50% 100%,
              #FF0000 0deg,     /* Poor - Red */
              #FF0000 36deg,    
              #FF8C00 36deg,    /* Bad - Orange */
              #FF8C00 72deg,
              #FFD700 72deg,    /* Fair - Yellow */
              #FFD700 108deg,
              #90EE90 108deg,   /* Normal - Light green */
              #90EE90 144deg,
              #008000 144deg,   /* Good - Dark green */
              #008000 180deg
            )`,
            clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)',
          }}
        />

        {/* Labels */}
        <div className="absolute inset-0">
          <span className="absolute text-[10px] font-medium text-white" style={{ left: '10%', top: '40%' }}>POOR</span>
          <span className="absolute text-[10px] font-medium text-white" style={{ left: '30%', top: '25%' }}>BAD</span>
          <span className="absolute text-[10px] font-medium text-white" style={{ left: '50%', top: '15%', transform: 'translateX(-50%)' }}>FAIR</span>
          <span className="absolute text-[10px] font-medium text-white" style={{ right: '30%', top: '25%' }}>NORMAL</span>
          <span className="absolute text-[10px] font-medium text-white" style={{ right: '10%', top: '40%' }}>GOOD</span>
        </div>

        {/* Black base/housing */}
        <div 
          className="absolute bottom-0 left-1/2 w-8 h-4 bg-black rounded-t-full"
          style={{
            transform: 'translateX(-50%)',
          }}
        />

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-16 bg-black origin-bottom transition-transform duration-700"
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