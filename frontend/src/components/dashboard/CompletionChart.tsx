import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataItem {
  date: string;
  completed: number;
  total: number;
}

interface CompletionChartProps {
  data: ChartDataItem[];
}

function formatDayName(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function CompletionChart({ data }: CompletionChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    day: formatDayName(d.date),
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Weekly Activity</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(99, 102, 241, 0.08)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="rgba(99, 102, 241, 0.08)" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} stroke="rgba(99, 102, 241, 0.08)" />
            <Tooltip
              cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const { completed, total, day } = payload[0].payload;
                return (
                  <div style={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.1)",
                  }}>
                    <p style={{ color: "#9ca3af", fontSize: "11px", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{day}</p>
                    <p style={{ color: "#e5e7eb", fontSize: "16px", fontWeight: 700, margin: "4px 0 0" }}>
                      {completed}/{total} <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 500 }}>completed</span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="completed" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
