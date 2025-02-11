
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
        <CartesianGrid 
          horizontal={true} 
          vertical={false} 
          stroke="rgba(158, 158, 158, 0.1)"
          strokeDasharray="3 3"
        />
        <CartesianGrid
          horizontal={true}
          vertical={false}
          y={0}
          stroke="#4ade80"
          strokeWidth={1}
          opacity={0.2}
        />
        <CartesianGrid
          horizontal={true}
          vertical={false}
          y={100}
          stroke="#4ade80"
          strokeWidth={1}
          opacity={0.3}
        />
        <CartesianGrid
          horizontal={true}
          vertical={false}
          y={-100}
          stroke="#f43f5e"
          strokeWidth={1}
          opacity={0.3}
        />
        <XAxis 
          dataKey="tradeNum" 
          label={{ value: 'Trade', position: 'bottom' }}
        />
        <YAxis 
          domain={[-100, 100]} 
          label={{ 
            value: 'Updraw / Drawdown', 
            angle: -90, 
            position: 'insideLeft' 
          }} 
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
