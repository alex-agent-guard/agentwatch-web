import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Download, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { mockAuditEvents } from '@/data/mockData'
import type { AuditEvent } from '@/data/mockData'
import EventDetailDrawer from './EventDetailDrawer'

const statusConfig = {
  ALLOW: { bg: 'rgba(0,212,170,0.12)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.2)', label: 'Allowed' },
  WARN: { bg: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)', label: 'Warned' },
  BLOCK: { bg: 'rgba(255,77,79,0.12)', color: '#FF4D4F', border: '1px solid rgba(255,77,79,0.2)', label: 'Blocked' },
}

type StatusFilter = 'ALL' | 'ALLOW' | 'WARN' | 'BLOCK'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

function getRiskColor(score: number): string {
  if (score <= 30) return '#00D4AA'
  if (score <= 70) return '#F5A623'
  return '#FF4D4F'
}

export default function EventTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const pageSize = 8

  const filteredEvents = useMemo(() => {
    return mockAuditEvents.filter((event) => {
      const matchesSearch = searchTerm === '' || event.event_id.toLowerCase().includes(searchTerm.toLowerCase()) || event.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) || (event.action && event.action.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === 'ALL' || event.final_decision === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  const paginatedEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize)

  const handleCopyHash = async (hash: string, eventId: string) => {
    try { await navigator.clipboard.writeText(hash); setCopiedHash(eventId); setTimeout(() => setCopiedHash(null), 2000) } catch { /* ignore */ }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="overflow-hidden rounded-xl" style={{ background: '#111216', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>Recent Audit Events</h3>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: 'rgba(41,121,255,0.12)', color: '#2979FF', border: '1px solid rgba(41,121,255,0.2)' }}>124</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-md px-3 py-2" style={{ background: '#14161E', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Search className="h-4 w-4" style={{ color: '#5C6270' }} />
              <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }} className="bg-transparent text-sm outline-none" style={{ color: '#FFFFFF', width: '160px' }} />
            </div>
            <div className="relative">
              <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex h-9 w-9 items-center justify-center rounded-md" style={{ border: '1px solid rgba(255,255,255,0.04)', color: '#9CA3AF' }}><Filter className="h-4 w-4" /></button>
              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.1 }} className="absolute right-0 top-10 z-20 w-40 rounded-lg py-1 shadow-lg" style={{ background: '#16181F', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {(['ALL', 'ALLOW', 'WARN', 'BLOCK'] as StatusFilter[]).map((status) => (
                      <button key={status} onClick={() => { setStatusFilter(status); setShowFilterMenu(false); setPage(1) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[#1A1D26]" style={{ color: statusFilter === status ? '#FFFFFF' : '#9CA3AF' }}>
                        {status === 'ALL' ? 'All Statuses' : <><div className="h-2 w-2 rounded-full" style={{ background: statusConfig[status].color }} />{statusConfig[status].label}</>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-md" style={{ border: '1px solid rgba(255,255,255,0.04)', color: '#9CA3AF' }}><Download className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['Event ID', 'Timestamp', 'Tool Name', 'Action', 'Status', 'Risk Score', 'HMAC Hash'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5C6270' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map((event, index) => {
                const status = statusConfig[event.final_decision]
                return (
                  <motion.tr key={event.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.04 * index, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }} onClick={() => setSelectedEvent(event)} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1A1D26' }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <td className="whitespace-nowrap px-6 py-3"><span className="text-[13px]" style={{ color: '#5C6270', fontFamily: '"JetBrains Mono", monospace' }}>{event.event_id}</span></td>
                    <td className="whitespace-nowrap px-6 py-3"><span className="text-[13px]" style={{ color: '#9CA3AF', fontFamily: '"JetBrains Mono", monospace' }}>{formatDate(event.created_at)}</span></td>
                    <td className="whitespace-nowrap px-6 py-3"><span className="text-sm" style={{ color: '#FFFFFF' }}>{event.tool_name}</span></td>
                    <td className="max-w-[200px] truncate px-6 py-3"><span className="text-sm" style={{ color: '#9CA3AF' }}>{event.action || '-'}</span></td>
                    <td className="whitespace-nowrap px-6 py-3"><span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ background: status.bg, color: status.color, border: status.border }}>{status.label}</span></td>
                    <td className="whitespace-nowrap px-6 py-3"><span className="text-[13px] font-medium" style={{ color: getRiskColor(event.risk_score || 0), fontFamily: '"JetBrains Mono", monospace' }}>{event.risk_score}</span></td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className="max-w-[120px] cursor-pointer truncate text-[13px]" style={{ color: '#5C6270', fontFamily: '"JetBrains Mono", monospace' }} onClick={(e) => { e.stopPropagation(); handleCopyHash(event.hmac, event.id) }}>{event.hmac.slice(0, 6)}...{event.hmac.slice(-4)}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleCopyHash(event.hmac, event.id) }} style={{ color: copiedHash === event.id ? '#00D4AA' : '#5C6270' }}>{copiedHash === event.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-sm" style={{ color: '#5C6270' }}>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredEvents.length)} of {filteredEvents.length} events</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: page === 1 ? 'transparent' : '#16181F', color: page === 1 ? '#5C6270' : '#9CA3AF' }}><ChevronLeft className="h-4 w-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className="flex h-8 w-8 items-center justify-center rounded-md text-sm" style={{ background: p === page ? '#16181F' : 'transparent', color: p === page ? '#FFFFFF' : '#9CA3AF' }}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: page === totalPages ? 'transparent' : '#16181F', color: page === totalPages ? '#5C6270' : '#9CA3AF' }}><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {selectedEvent && <EventDetailDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </>
  )
}
