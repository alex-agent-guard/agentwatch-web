import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  activity: Activity,
  shieldCheck: ShieldCheck,
  alertTriangle: AlertTriangle,
  shieldAlert: ShieldAlert,
};

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  percentage?: string;
  sparklineData: number[];
  color: string;
  glowGradient: string;
  iconName: string;
  index: number;
}

export default function StatCard({
  label,
  value,
  change,
  percentage,
  sparklineData,
  color,
  glowGradient,
  iconName,
  index,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const Icon = iconMap[iconName] || Activity;

  const isPositive = change.startsWith('+');
  const isNeutral = change === '0%' || change === '-';
  const TrendIcon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  const trendColor = isPositive ? '#00D4AA' : isNeutral ? '#9CA3AF' : '#FF4D4F';

  // Build SVG sparkline path
  const w = 120;
  const h = 40;
  const maxVal = Math.max(...sparklineData, 1);
  const minVal = Math.min(...sparklineData);
  const range = maxVal - minVal || 1;
  const points = sparklineData.map((v, i) => {
    const x = (i / (sparklineData.length - 1)) * w;
    const y = h - ((v - minVal) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl border p-5"
      style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: glowGradient }} />

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <span className="text-xs font-medium text-slate-400">{label}</span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-2xl font-bold text-white" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            {value}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <TrendIcon className="h-3 w-3" style={{ color: trendColor }} />
            <span className="text-xs font-medium" style={{ color: trendColor }}>{change}</span>
            {percentage && <span className="text-xs text-slate-500">· {percentage}</span>}
          </div>
        </div>

        {/* Sparkline */}
        <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`sparkGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points={`0,${h} ${points.replace(/ /g, ' ')} ${w},${h}`}
            fill={`url(#sparkGrad-${index})`}
          />
        </svg>
      </div>
    </motion.div>
  );
}
