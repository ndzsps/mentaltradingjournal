
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
  Scatter,
} from "recharts";
import { ChartData } from "../types";

interface MfeMaeBarChartProps {
  data: ChartData[];
}

export function MfeMaeBarChart({ data }: MfeMaeBarChartProps) {
  // Reverse the data array and then map the trade numbers
  const dataWithNumbers = [...data].reverse().map((item, index) => ({
    ...item,
    tradeNum: (index + 1).toString(),
    // If mfeRelativeToTp is positive, use it as the reference for captured move
    // If mfeRelativeToTp is negative or zero, use maeRelativeToSl
    capturedMove: item.mfeRelativeToTp > 0 ? item.mfeRelativeToTp * (item.capturedMove! / 100) : item.maeRelativeToSl * (item.capturedMove! / 100)
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
        <ReferenceLine y={0} stroke="#FEF7CD" strokeWidth={2} />
        <ReferenceLine y={100} stroke="#4ade80" strokeWidth={2} />
        <ReferenceLine y={-100} stroke="#f43f5e" strokeWidth={2} />
        <XAxis 
          dataKey="tradeNum" 
          label={{ value: 'Trade', position: 'bottom' }}
        />
        <YAxis 
          domain={[-100, 100]} 
          label={{ 
            value: 'Updraw / Drawdown', 
            angle: -90, 
            position: 'insideLeft',
            offset: 0,
            dy: 60
          }} 
        />
        <Tooltip 
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;

            const data = payload[0].payload;
            const updrawValue = data.mfeRelativeToTp;
            const drawdownValue = data.maeRelativeToSl;
            const capturedMove = data.capturedMove;

            return (
              <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                <div className="space-y-2">
                  <p className="text-lg font-bold">Trade #{data.tradeNum}</p>
                  <p className="text-lg">{data.instrument || 'Unknown'}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                    <span>Updraw: {updrawValue?.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                    <span>Drawdown: {Math.abs(drawdownValue)?.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white" />
                    <span>Exit Point: {capturedMove?.toFixed(2)}%</span>
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
        <Scatter
          dataKey="capturedMove"
          fill="white"
          name="Exit Point"
          shape="circle"
          legendType="circle"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

