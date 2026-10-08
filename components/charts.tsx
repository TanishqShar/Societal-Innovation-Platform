"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

type Datum = { name: string; value: number };

const PIE_COLORS = ["#94a3b8", "#f59e0b", "#0284c7", "#3b82f6", "#8b5cf6", "#10b981", "#059669", "#ef4444"];

export function CategoryBarChart({ data }: { data: Datum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ left: -10, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis
          dataKey="name"
          angle={-35}
          textAnchor="end"
          interval={0}
          tick={{ fontSize: 11 }}
          height={60}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DistrictBarChart({ data }: { data: Datum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11 }}
          width={120}
        />
        <Tooltip />
        <Bar dataKey="value" fill="#ea580c" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StateBarChart({ data }: { data: Datum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ data }: { data: Datum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius={95}
          innerRadius={48}
          paddingAngle={2}
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({
  data,
}: {
  data: { month: string; challenges: number; projects: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="challenges"
          name="Reported Challenges"
          stroke="#0284c7"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="projects"
          name="Active Innovation Projects"
          stroke="#15803d"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ProjectLifecycleFunnel({
  stages,
}: {
  stages: { name: string; count: number; percentage: number; color: string }[];
}) {
  return (
    <div className="space-y-3 py-2">
      {stages.map((st) => (
        <div key={st.name} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">{st.name}</span>
            <div className="space-x-2">
              <span className="font-bold text-slate-900">{st.count}</span>
              <span className="text-black/40 font-mono">({st.percentage}%)</span>
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${st.color}`}
              style={{ width: `${Math.max(6, st.percentage)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
