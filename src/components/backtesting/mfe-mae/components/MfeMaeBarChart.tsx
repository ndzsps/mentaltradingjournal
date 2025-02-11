
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChartData } from "../types";

interface MfeMaeBarChartProps {
  data: ChartData[];
}

export function MfeMaeBarChart({ data }: MfeMaeBarChartProps) {
  const dataWithNumbers = data.map((item, index) => ({
    ...item,
    tradeNum: (index + 1).toString()
  }));

  // Find actual max and min values for proper domain scaling
  const maxMfe = Math.max(...data.map(d => d.mfeRelativeToTp));
  const minMae = Math.min(...data.map(d => d.maeRelativeToSl));

  // Scale domain to next hundred to ensure proper visualization
  const maxDomain = Math.ceil(maxMfe / 100) * 100;
  const minDomain = Math.floor(minMae / 100) * 100;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={dataWithNumbers}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        stackOffset="sign"
      >
        {/* Background grid */}
        <CartesianGrid 
          horizontal={true} 
          vertical={false} 
          stroke="rgba(158, 158, 158, 0.1)"
          strokeDasharray="3 3"
        />
        {/* Zero line */}
        <ReferenceLine y={0} stroke="#FEF7CD" strokeWidth={2} />
        {/* Reference lines for 100 and -100 */}
        <ReferenceLine y={100} stroke="#4ade80" strokeWidth={2} />
        <ReferenceLine y={-100} stroke="#f43f5e" strokeWidth={2} />
        <XAxis 
          dataKey="tradeNum" 
          label={{ value: 'Trade', position: 'bottom' }}
        />
        <YAxis 
          domain={[minDomain, maxDomain]}
          label={{ 
            value: 'Updraw / Drawdown', 
            angle: -90, 
            position: 'insideLeft',
            offset: 0,
            dy: 60
          }} 
          ticks={[-100, -75, -50, -25, 0, 25, 50, 75, 100]}
        />
        <Tooltip 
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;

            const data = payload[0].payload;
            const updrawValue = payload.find(p => p.dataKey === 'mfeRelativeToTp')?.value;
            const drawdownValue = payload.find(p => p.dataKey === 'maeRelativeToSl')?.value;

            return (
              <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                <div className="space-y-2">
                  <p className="text-lg font-bold">Trade #{data.tradeNum}</p>
                  <p className="text-lg">{data.instrument || 'Unknown'}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                    <span>Updraw: {typeof updrawValue === 'number' ? updrawValue.toFixed(2) : '0'}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                    <span>Drawdown: {typeof drawdownValue === 'number' ? Math.abs(drawdownValue).toFixed(2) : '0'}%</span>
                  </div>
                  <p>R-Multiple: {data.rMultiple?.toFixed(2) || '0'}</p>
                </div>
              </div>
            );
          }}
        />
        <Legend 
          verticalAlign="top" 
          align="right"
          wrapperStyle={{ 
            paddingBottom: "20px" 
          }}
        />
        <Bar 
          dataKey="mfeRelativeToTp" 
          fill="#4ade80" 
          name="Updraw" 
          stackId="stack"
        />
        <Bar 
          dataKey="maeRelativeToSl" 
          fill="#f43f5e" 
          name="Drawdown" 
          stackId="stack"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
