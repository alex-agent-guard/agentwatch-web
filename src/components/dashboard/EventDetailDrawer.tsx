import { motion } from 'framer-motion'
import { X, ShieldCheck, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { AuditEvent } from '@/data/mockData'

interface EventDetailDrawerProps {
  event: AuditEvent
  onClose: () => void
}

const statusConfig = {
  ALLOW: { bg: 'rgba(0,212,170,0.12)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.2)', label: 'Allowed' },
  WARN: { bg: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)', label: 'Warned' },
  BLOCK: { bg: 'rgba(255,77,79,0.12)', color: '#FF4D4F', border: '1px solid rgba(255,77,79,0.2)', label: 'Blocked' },
}

function getRiskColor(score: number): string {
  if (score <= 30) return '#00D4AA'
  if (score <= 70) return '#F5A623'
  return '#FF4D4F'
}

export default function EventDetailDrawer({ event, onClose }: EventDetailDrawerProps) {
  const [copiedHash, setCopiedHash] = useState(false)
  const status = statusConfig[event.final_decision]

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(event.hmac)
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col overflow-y-auto sm:w-[480px]"
        style={{ background: '#16181F', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xl font-semibold" style={{ color: '#FFFFFF', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '-0.01em' }}>{event.event_id}</span>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md transition-colors" style={{ color: '#9CA3AF' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" style={{ background: status.bg, color: status.color, border: status.border }}>{status.label}</span>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg p-4" style={{ background: '#111216', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#5C6270' }}>Tool Name</span>
              <p className="mt-1 text-sm font-medium" style={{ color: '#FFFFFF' }}>{event.tool_name}</p>
            </div>
            <div className="rounded-lg p-4" style={{ background: '#111216', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#5C6270' }}>Risk Score</span>
              <p className="mt-1 text-sm font-semibold" style={{ color: getRiskColor(event.risk_score || 0), fontFamily: '"JetBrains Mono", monospace' }}>{event.risk_score}</p>
            </div>
            <div className="rounded-lg p-4" style={{ background: '#111216', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#5C6270' }}>Timestamp</span>
              <p className="mt-1 text-xs" style={{ color: '#9CA3AF', fontFamily: '"JetBrains Mono", monospace' }}>{new Date(event.created_at).toISOString().replace('T', ' ').slice(0, 19)}</p>
            </div>
            <div className="rounded-lg p-4" style={{ background: '#111216', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#5C6270' }}>Install ID</span>
              <p className="mt-1 text-xs" style={{ color: '#9CA3AF', fontFamily: '"JetBrains Mono", monospace' }}>{event.install_id}</p>
            </div>
          </div>

          <div className="mb-6 rounded-lg p-4" style={{ background: '#111216', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#5C6270' }}>Action</span>
            <p className="mt-1 text-sm" style={{ color: '#FFFFFF', fontFamily: '"JetBrains Mono", monospace' }}>{event.action || '-'}</p>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold" style={{ color: '#FFFFFF' }}>HMAC Chain</h4>
            <div className="rounded-lg p-4" style={{ background: '#111216', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs" style={{ color: '#5C6270' }}>Current Hash</span>
                  <span className="text-xs font-medium" style={{ color: '#7B61FF', fontFamily: '"JetBrains Mono", monospace' }}>{event.hmac.slice(0, 14)}...{event.hmac.slice(-6)}</span>
                </div>
                <button onClick={handleCopyHash} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors" style={{ color: copiedHash ? '#00D4AA' : '#5C6270' }}>
                  {copiedHash ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" style={{ color: '#00D4AA' }} />
                <span className="text-xs font-medium" style={{ color: '#00D4AA' }}>Verified</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold" style={{ color: '#FFFFFF' }}>Parameters</h4>
            <pre className="overflow-x-auto rounded-lg p-4 text-xs leading-relaxed" style={{ background: '#0A0B0E', color: '#E8ECF1', fontFamily: '"JetBrains Mono", monospace', border: '1px solid rgba(255,255,255,0.04)' }}>
{`{\n  "tool": "${event.tool_name}",\n  "action": "${event.action?.replace(/'/g, "\\'") || 'unknown'}",\n  "timestamp": ${event.timestamp_ms},\n  "risk_score": ${event.risk_score},\n  "decision": "${event.final_decision}"\n}`}
            </pre>
          </div>
        </div>

        <div className="flex gap-3 p-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-all" style={{ background: 'linear-gradient(135deg, #2979FF, #1E88E5)' }}>View Full Report</button>
          <button onClick={onClose} className="rounded-lg px-5 py-2.5 text-sm font-medium transition-colors" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#9CA3AF' }}>Close</button>
        </div>
      </motion.div>
    </>
  )
}
