import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, Copy, Check, Link2 } from 'lucide-react'

interface HmacBlock {
  shortHash: string
  fullHash: string
  timestamp: string
  status: 'verified' | 'pending' | 'error'
}

const hmacBlocks: HmacBlock[] = [
  { shortHash: '0x7a3f...e9d2', fullHash: '0x7a3f8c21b4e6d9a0f5c3e7b1d4a8f2e5c6b3a9d0e7f4c1b8a5d2e9f6c3b0a7d4e1f8c5b2a9d6e3f0c7b4a1d8e5f2c9b6a3d0e7f4c1b8a5d2e9f6c3b0a7d4e1f8c5b2a9d6e3f0c7b4a1d8e5f2c9b6', timestamp: '2025-01-15 14:23:01', status: 'verified' },
  { shortHash: '0x2b8c...f1a4', fullHash: '0x2b8c5d3e7f1a9b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0', timestamp: '2025-01-15 14:23:05', status: 'verified' },
  { shortHash: '0x9e1d...b3c7', fullHash: '0x9e1d4f7a2b5c8d0e3f6a9b1c4d7e0f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7', timestamp: '2025-01-15 14:23:09', status: 'verified' },
  { shortHash: '0x4f6a...d8e2', fullHash: '0x4f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4c7d0e3f6a9b2c5', timestamp: '2025-01-15 14:23:12', status: 'verified' },
]

const statusConfig = {
  verified: { icon: ShieldCheck, color: '#00D4AA', bg: 'rgba(0,212,170,0.1)', label: 'Verified' },
  pending: { icon: Link2, color: '#F5A623', bg: 'rgba(245,166,35,0.1)', label: 'Pending' },
  error: { icon: Link2, color: '#FF4D4F', bg: 'rgba(255,77,79,0.1)', label: 'Error' },
}

export default function HmacChain() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const handleCopy = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHash(hash)
      setTimeout(() => setCopiedHash(null), 2000)
    } catch { /* ignore */ }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="rounded-xl border p-5"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">HMAC Chain Verification</h3>
          <p className="text-xs text-slate-500 mt-0.5">Cryptographic audit chain integrity</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="text-xs text-[#00D4AA]">Chain Valid</span>
        </div>
      </div>

      <div className="space-y-3">
        {hmacBlocks.map((block, i) => {
          const cfg = statusConfig[block.status]
          const StatusIcon = cfg.icon
          return (
            <motion.div
              key={block.shortHash}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-lg p-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: cfg.bg }}>
                <StatusIcon className="h-4 w-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: '#7B61FF', fontFamily: '"JetBrains Mono", monospace' }}>{block.shortHash}</p>
                <p className="text-[10px] text-slate-500">{block.timestamp}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                <button onClick={() => handleCopy(block.fullHash)} className="flex h-6 w-6 items-center justify-center rounded transition-colors" style={{ color: copiedHash === block.fullHash ? '#00D4AA' : '#5C6270' }}>
                  {copiedHash === block.fullHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              {i < hmacBlocks.length - 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 hidden" />
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
