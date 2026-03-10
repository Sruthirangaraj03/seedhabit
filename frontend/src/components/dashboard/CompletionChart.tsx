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
    <div
      className="system-panel relative flex w-full flex-col overflow-hidden rounded-xl p-6"
      style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(0, 212, 255, 0.15)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(0, 212, 255, 0.05)",
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <h3
          className="system-label text-sm font-bold uppercase tracking-[0.15em]"
          style={{
            color: "#00d4ff",
            textShadow: "0 0 10px rgba(0,212,255,0.4)",
          }}
        >
          WEEKLY POWER ANALYSIS
        </h3>
      </div>

      <div className="min-h-48 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="systemBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity={1} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(0, 212, 255, 0.08)"
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "rgba(0, 212, 255, 0.5)" }}
              stroke="rgba(0, 212, 255, 0.1)"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "rgba(0, 212, 255, 0.5)" }}
              stroke="rgba(0, 212, 255, 0.1)"
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 212, 255, 0.03)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const { completed, total, day } = payload[0].payload;
                return (
                  <div style={{
                    backgroundColor: "rgba(10, 15, 30, 0.95)",
                    border: "1px solid rgba(0, 212, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 0 20px rgba(0, 212, 255, 0.15), inset 0 0 10px rgba(0, 212, 255, 0.02)",
                  }}>
                    <p style={{
                      color: "#00d4ff",
                      fontSize: "10px",
                      margin: 0,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      textShadow: "0 0 8px rgba(0,212,255,0.4)",
                    }}>
                      {day}
                    </p>
                    <p style={{ color: "#e5e7eb", fontSize: "16px", fontWeight: 700, margin: "4px 0 0" }}>
                      {completed}/{total}{" "}
                      <span style={{
                        fontSize: "10px",
                        color: "rgba(0, 212, 255, 0.4)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}>
                        cleared
                      </span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="completed" fill="url(#systemBarGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
