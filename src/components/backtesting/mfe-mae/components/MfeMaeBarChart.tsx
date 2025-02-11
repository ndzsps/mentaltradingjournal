
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
  // Map the data to include a tradeNumber
  const dataWithNumbers = data.map((item, index) => ({
    ...item,
    tradeNumber: (index + 1).toString()
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="tradeNumber" 
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
          formatter={(value: number, name: string, props: { payload: ChartData }) => {
            const label = name === 'mfeRelativeToTp' 
              ? 'Updraw' 
              : 'Drawdown';
            return [
              `${value.toFixed(2)}%`,
              `${label} - ${props.payload.instrument || 'Unknown'}\nR-Multiple: ${props.payload.rMultiple?.toFixed(2)}`
            ];
          }}
        />
        <Legend 
          verticalAlign="top" 
          align="right"
        />
        <Bar 
          dataKey="mfeRelativeToTp" 
          fill="#4ade80" 
          name="MFE Relative to TP (%)" 
          stackId="stack"
        />
        <Bar 
          dataKey="maeRelativeToSl" 
          fill="#f43f5e" 
          name="Drawdown (%)" 
          stackId="stack"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
