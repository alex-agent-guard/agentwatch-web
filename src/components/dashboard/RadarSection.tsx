import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { dimension: 'Call Freq', current: 85, baseline: 80 },
  { dimension: 'Time Patt', current: 72, baseline: 75 },
  { dimension: 'Tool Div', current: 90, baseline: 70 },
  { dimension: 'Param Var', current: 65, baseline: 80 },
  { dimension: 'Error Rate', current: 95, baseline: 90 },
  { dimension: 'Data Sens', current: 78, baseline: 85 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2 shadow-lg" style={{ backgroundColor: '#16181F', borderColor: 'rgba(255,255,255,0.08)' }}>
      <p className="text-xs font-medium text-white mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function RadarSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border p-5"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Behavioral Baseline</h3>
          <p className="text-xs text-slate-500 mt-0.5">6-dimension risk profile</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#2979FF]" />
            <span className="text-[10px] text-slate-400">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#7B61FF]" />
            <span className="text-[10px] text-slate-400">Baseline</span>
          </div>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
            <PolarRadiusAxis tick={{ fontSize: 9, fill: '#6B7280' }} domain={[0, 100]} axisLine={false} />
            <Radar name="Current" dataKey="current" stroke="#2979FF" fill="#2979FF" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Baseline" dataKey="baseline" stroke="#7B61FF" fill="#7B61FF" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
