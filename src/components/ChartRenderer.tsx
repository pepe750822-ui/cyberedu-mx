import React, { useState } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, BarChart2, PieChart as PieIcon, Activity, Download, Maximize2, Minimize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Paleta de colores coherente con el diseño oscuro ──
const PALETTE = [
  "#6366f1", // indigo (primary)
  "#22d3ee", // cyan
  "#f59e0b", // amber
  "#10b981", // emerald
  "#f43f5e", // rose
  "#a78bfa", // violet
  "#fb923c", // orange
  "#34d399", // green
];

export interface ChartData {
  type: "line" | "bar" | "area" | "pie";
  title?: string;
  xLabel?: string;
  yLabel?: string;
  data: Record<string, any>[];
  /** Claves a graficar (excepto 'x' / 'name'). Si no se proveen, se detectan automáticamente */
  keys?: string[];
  /** Colores opcionales para cada serie */
  colors?: string[];
  /** Mostrar leyenda */
  legend?: boolean;
  /** Cuadrícula */
  grid?: boolean;
}

const CHART_ICONS: Record<ChartData["type"], React.ElementType> = {
  line: TrendingUp,
  bar: BarChart2,
  area: Activity,
  pie: PieIcon,
};

/** Detecta automáticamente las claves numéricas del dato */
function detectKeys(data: Record<string, any>[]): string[] {
  if (!data || !Array.isArray(data) || !data.length) return [];
  return Object.keys(data[0]).filter((k) => k !== "x" && k !== "name" && typeof data[0][k] === "number");
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-xl px-3 py-2 shadow-xl backdrop-blur-sm text-xs">
      {label && <p className="text-slate-400 font-bold mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString("es-MX") : p.value}
        </p>
      ))}
    </div>
  );
};

const ChartRenderer: React.FC<{ chart: ChartData }> = ({ chart }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fallback to empty array if chart.data is missing or invalid
  const validData = Array.isArray(chart?.data) ? chart.data : [];

  const keys = chart.keys?.length ? chart.keys : detectKeys(validData);
  const colors = chart.colors?.length ? chart.colors : PALETTE;
  const showLegend = chart.legend !== false && keys.length > 1;
  const showGrid = chart.grid !== false;
  const Icon = CHART_ICONS[chart?.type] || TrendingUp;

  // ── Nombre del eje X: prioriza "x", luego "name" ──
  const xKey = validData[0] && "x" in validData[0] ? "x" : "name";

  const chartHeight = isFullscreen ? "h-[55vh]" : "h-[220px] sm:h-[260px]";

  const renderChart = () => {
    // Si no hay datos, mostrar un placeholder o retornar null
    if (!validData.length) {
      return (
        <div className="flex items-center justify-center h-full w-full text-slate-500 text-sm">
          No hay datos para graficar.
        </div>
      );
    }

    const commonProps = {
      data: validData,
      margin: { top: 8, right: 16, left: 0, bottom: 4 },
    };

    const axisStyle = { fontSize: 10, fill: "#64748b", fontWeight: 700 };
    const xAxis = <XAxis dataKey={xKey} tick={axisStyle} label={chart.xLabel ? { value: chart.xLabel, position: "insideBottom", offset: -2, fill: "#475569", fontSize: 10 } : undefined} />;
    const yAxis = <YAxis tick={axisStyle} width={36} label={chart.yLabel ? { value: chart.yLabel, angle: -90, position: "insideLeft", fill: "#475569", fontSize: 10 } : undefined} />;
    const grid = showGrid ? <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /> : null;
    const tooltip = <Tooltip content={<CustomTooltip />} />;
    const legend = showLegend ? <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} /> : null;

    if (chart.type === "pie") {
      const pieKey = keys[0] || "value";
      return (
        <PieChart>
          <Pie
            data={validData}
            dataKey={pieKey}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            outerRadius={isFullscreen ? 140 : 90}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
          >
            {validData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} stroke="rgba(0,0,0,0.3)" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />}
        </PieChart>
      );
    }

    if (chart.type === "bar") {
      return (
        <BarChart {...commonProps}>
          {grid}{xAxis}{yAxis}{tooltip}{legend}
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      );
    }

    if (chart.type === "area") {
      return (
        <AreaChart {...commonProps}>
          <defs>
            {keys.map((k, i) => (
              <linearGradient key={k} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {grid}{xAxis}{yAxis}{tooltip}{legend}
          {keys.map((k, i) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              fill={`url(#grad-${i})`}
              dot={{ r: 3, fill: colors[i % colors.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </AreaChart>
      );
    }

    // Default: line
    return (
      <LineChart {...commonProps}>
        {grid}{xAxis}{yAxis}{tooltip}{legend}
        {keys.map((k, i) => (
          <Line
            key={k}
            type="monotone"
            dataKey={k}
            stroke={colors[i % colors.length]}
            strokeWidth={2.5}
            dot={{ r: 3, fill: colors[i % colors.length] }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    );
  };

  return (
    <>
      <div className={cn(
        "group my-5 bg-slate-900/50 border border-white/5 rounded-[1.75rem] overflow-hidden transition-all w-full max-w-full",
        isFullscreen && "fixed inset-4 z-[1000] bg-slate-950/98 backdrop-blur-xl border-white/10 flex flex-col"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/20 rounded-lg">
              <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-wider">
              {chart.title || "Gráfica"}
            </span>
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-black text-slate-500 uppercase tracking-wider">
              {chart.type || "unknown"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className={cn("p-4 w-full", chartHeight, isFullscreen && "flex-1 h-auto")}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Footer labels */}
        {(chart.xLabel || chart.yLabel) && (
          <div className="px-4 pb-3 flex items-center gap-4 opacity-50">
            {chart.xLabel && (
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Eje X: {chart.xLabel}
              </span>
            )}
            {chart.yLabel && (
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Eje Y: {chart.yLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Spacer when fullscreen */}
      {isFullscreen && <div className="h-[300px]" />}
    </>
  );
};

export default ChartRenderer;
