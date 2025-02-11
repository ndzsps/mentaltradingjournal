
interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const AssetPairTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
        <p className="text-lg font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className={`text-sm flex items-center gap-2 ${
              entry.dataKey === "profit"
                ? "text-emerald-400"
                : entry.dataKey === "loss"
                ? "text-red-400"
                : ""
            }`}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}:
            </span>
            <span className="font-medium text-foreground">
              {entry.dataKey === "loss"
                ? `$${Math.abs(entry.value).toLocaleString()}`
                : `$${entry.value.toLocaleString()}`}
            </span>
          </p>
        ))}
        <p className="text-sm font-medium border-t border-border mt-2 pt-2 flex items-center gap-2">
          <span className="text-muted-foreground">Net:</span>
          <span className="text-foreground">${payload[0].payload.net.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};
