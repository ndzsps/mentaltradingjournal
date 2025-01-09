import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '@/components/ui/card';

interface RiskRewardData {
  risk: number;
  reward: number;
  size: number;
  direction: 'buy' | 'sell';
}

interface RiskRewardChartProps {
  data: RiskRewardData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <Card>
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
        <p className="font-medium text-sm text-foreground mb-2">Trade Details</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Direction:</span>
            <span className="font-medium text-foreground capitalize">{data.direction}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Risk:</span>
            <span className="font-medium text-foreground">${data.risk.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Reward:</span>
            <span className="font-medium text-foreground">${data.reward.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Position Size:</span>
            <span className="font-medium text-foreground">{data.size}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const RiskRewardChart = ({ data }: RiskRewardChartProps) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="risk" 
            name="Risk" 
            unit="$"
            label={{ value: 'Risk ($)', position: 'bottom' }} 
          />
          <YAxis 
            type="number" 
            dataKey="reward" 
            name="Reward" 
            unit="$"
            label={{ value: 'Reward ($)', angle: -90, position: 'left' }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter 
            name="Risk/Reward" 
            data={data} 
            fill="var(--primary)" 
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};