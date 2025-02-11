
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        stackOffset="sign"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="id" 
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
          formatter={(value: number, name: string, props: { payload: ChartData }) => [
            `${value.toFixed(2)}%`,
            `${name} - ${props.payload.instrument || 'Unknown'}`
          ]}
        />
        <Legend />
        <Bar 
          dataKey="mfeRelativeToTp" 
          fill="#4ade80" 
          name="MFE Relative to TP (%)" 
          stackId="stack"
          shape="circle"
        />
        <Bar 
          dataKey="maeRelativeToSl" 
          fill="#f43f5e" 
          name="Drawdown (%)" 
          stackId="stack"
          shape="circle"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
