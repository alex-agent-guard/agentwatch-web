import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-[100dvh]" style={{ backgroundColor: '#0D1117' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 lg:relative ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          width: sidebarOpen ? 240 : 72,
          backgroundColor: '#111820',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 px-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2979FF] to-[#7B61FF]">
                <Shield className="h-4 w-4 text-white" />
              </div>
              {sidebarOpen && (
                <span className="text-base font-bold text-white">
                  Agent<span className="text-[#2979FF]">Watch</span>
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto p-1.5 text-slate-400 hover:text-white lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Toggle button (desktop only) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mx-auto my-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:text-slate-300 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#2979FF]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={isActive ? { backgroundColor: 'rgba(41,121,255,0.1)' } : {}}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom status */}
          {sidebarOpen && (
            <div className="mx-3 mb-4 rounded-lg p-3" style={{ backgroundColor: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.15)' }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#00D4AA] animate-pulse" />
                <span className="text-xs font-medium text-[#00D4AA]">System Active</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-500">Monitoring 4 tools</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center gap-4 px-4 sm:px-6"
          style={{
            backgroundColor: 'rgba(13,17,23,0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-400 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">Agent Operator</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2979FF] to-[#7B61FF] flex items-center justify-center">
              <span className="text-xs font-bold text-white">AO</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
