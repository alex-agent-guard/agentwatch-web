import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import {
  RefreshCw,
  FileText,
  ChevronDown,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import RiskTrendChart from '@/components/dashboard/RiskTrendChart'
import RiskDistribution from '@/components/dashboard/RiskDistribution'
import RadarSection from '@/components/dashboard/RadarSection'
import EventTable from '@/components/dashboard/EventTable'
import HmacChain from '@/components/dashboard/HmacChain'
import {
  statsData,
  sparklineData,
} from '@/data/mockData'

const timeRanges = ['Last 24h', 'Last 7d', 'Last 30d', 'Custom']

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('Last 24h')
  const [showTimeMenu, setShowTimeMenu] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const navigate = useNavigate()

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 600)
  }, [])

  return (
    <DashboardLayout>
      {/* Ambient background effect */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(41,121,255,0.03) 0%, transparent 70%)',
          animation: 'ambientDrift 25s linear infinite',
          zIndex: 0,
        }}
      />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '24px' }}
      >
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.01em',
            }}
          >
            Security Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#9CA3AF' }}>
            Real-time monitoring for your AI Agent
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          {/* Time Range Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTimeMenu(!showTimeMenu)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#9CA3AF',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.1)'
                el.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                ;(e.currentTarget as HTMLElement).style.color = '#9CA3AF'
              }}
            >
              {timeRange}
              <ChevronDown className="h-4 w-4" />
            </button>
            {showTimeMenu && (
              <div
                className="absolute right-0 top-10 z-20 w-40 rounded-lg py-1 shadow-lg"
                style={{
                  background: '#16181F',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => { setTimeRange(range); setShowTimeMenu(false) }}
                    className="flex w-full px-4 py-2 text-sm transition-colors hover:bg-[#1A1D26]"
                    style={{
                      color: timeRange === range ? '#FFFFFF' : '#9CA3AF',
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#9CA3AF',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.1)'
              el.style.color = '#FFFFFF'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.06)'
              el.style.color = '#9CA3AF'
            }}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Generate Report Button */}
          <button
            onClick={() => navigate('/reports?action=generate')}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #2979FF, #1E88E5)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)' }}
          >
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
        </motion.div>
      </motion.div>

      {/* Stats Row */}
      <div className="relative z-10 mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Calls"
          value={statsData.totalCalls}
          change={statsData.changes.total}
          sparklineData={sparklineData.total}
          color="#2979FF"
          glowGradient="radial-gradient(circle at 50% 0%, rgba(41,121,255,0.08) 0%, transparent 60%)"
          iconName="activity"
          index={0}
        />
        <StatCard
          label="Allowed"
          value={statsData.allowed}
          change={statsData.changes.allowed}
          percentage={statsData.percentages.allowed}
          sparklineData={sparklineData.allowed}
          color="#00D4AA"
          glowGradient="radial-gradient(circle at 50% 0%, rgba(0,212,170,0.06) 0%, transparent 60%)"
          iconName="shieldCheck"
          index={1}
        />
        <StatCard
          label="Warned"
          value={statsData.warned}
          change={statsData.changes.warned}
          percentage={statsData.percentages.warned}
          sparklineData={sparklineData.warned}
          color="#F5A623"
          glowGradient="radial-gradient(circle at 50% 0%, rgba(245,166,35,0.06) 0%, transparent 60%)"
          iconName="alertTriangle"
          index={2}
        />
        <StatCard
          label="Blocked"
          value={statsData.blocked}
          change={statsData.changes.blocked}
          percentage={statsData.percentages.blocked}
          sparklineData={sparklineData.blocked}
          color="#FF4D4F"
          glowGradient="radial-gradient(circle at 50% 0%, rgba(255,77,79,0.08) 0%, transparent 60%)"
          iconName="shieldAlert"
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="relative z-10 mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RiskTrendChart />
        </div>
        <div className="lg:col-span-1">
          <RiskDistribution />
        </div>
      </div>

      {/* Radar Section */}
      <div className="relative z-10 mb-6">
        <RadarSection />
      </div>

      {/* Events Table */}
      <div className="relative z-10 mb-6">
        <EventTable />
      </div>

      {/* HMAC Chain */}
      <div className="relative z-10">
        <HmacChain />
      </div>

      {/* CSS for ambient animation */}
      <style>{`
        @keyframes ambientDrift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </DashboardLayout>
  )
}
