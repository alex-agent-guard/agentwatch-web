import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';

const data = [
  { time: '00:00', score: 12, baseline: 15 },
  { time: '04:00', score: 18, baseline: 15 },
  { time: '08:00', score: 25, baseline: 15 },
  { time: '12:00', score: 42, baseline: 20 },
  { time: '16:00', score: 35, baseline: 20 },
  { time: '20:00', score: 28, baseline: 18 },
  { time: '23:59', score: 15, baseline: 18 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2 shadow-lg" style={{ backgroundColor: '#16181F', borderColor: 'rgba(255,255,255,0.08)' }}>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function RiskTrendChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border p-5 h-full"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Risk Trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">Risk score over 24 hours</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#2979FF]" />
            <span className="text-[10px] text-slate-400">Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#7B61FF]" />
            <span className="text-[10px] text-slate-400">Baseline</span>
          </div>
        </div>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2979FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2979FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" fill="url(#riskAreaGrad)" stroke="none" />
            <Line type="monotone" dataKey="score" stroke="#2979FF" strokeWidth={2} dot={{ r: 3, fill: '#2979FF' }} name="Risk Score" />
            <Line type="monotone" dataKey="baseline" stroke="#7B61FF" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Baseline" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
