import React from 'react';

interface EmotionGaugeProps {
  score: number;
}

export const EmotionGauge = ({ score }: EmotionGaugeProps) => {
  // Calculate the rotation angle based on the score (0-100)
  // -90 to start at the left, then rotate based on score percentage
  const rotation = -90 + (score / 100) * 180;
  
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-12">
        {/* Background arc */}
        <div 
          className="absolute w-full h-full rounded-t-full overflow-hidden"
          style={{
            background: `conic-gradient(
              from 180deg at 50% 100%,
              #ef4444 0deg,      /* Red section */
              #ef4444 60deg,     /* Red section end */
              #fbbf24 60deg,     /* Yellow section start */
              #fbbf24 120deg,    /* Yellow section end */
              #22c55e 120deg,    /* Green section start */
              #22c55e 180deg     /* Green section end */
            )`,
            clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)',
            border: '2px solid #e5e7eb',
            borderBottom: 'none'
          }}
        />
        {/* Indicator needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-[3px] h-8 origin-bottom transition-transform duration-700"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            backgroundColor: '#1a1a1a',
          }}
        />
        {/* Center point */}
        <div 
          className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-gray-800 border-2 border-gray-200"
          style={{
            transform: 'translate(-50%, 50%)'
          }}
        />
      </div>
      <div className="text-2xl font-bold">
        {score.toFixed(0)}%
      </div>
    </div>
  );
};