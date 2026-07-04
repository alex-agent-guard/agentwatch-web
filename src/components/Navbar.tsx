import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/reports', label: 'Reports' },
    { to: '/settings', label: 'Settings' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-aw-border bg-aw-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-aw-blue" />
            <span className="text-xl font-bold">AgentWatch</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  location.pathname === link.to
                    ? 'text-aw-blue'
                    : 'text-aw-text-secondary hover:text-aw-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/auth"
              className="rounded-lg bg-aw-blue px-4 py-2 text-sm font-medium text-white hover:bg-aw-blue/90"
            >
              Sign In
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-aw-border bg-aw-bg"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/auth" className="block text-sm text-aw-blue">
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
