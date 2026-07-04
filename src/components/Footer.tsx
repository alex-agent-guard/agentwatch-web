import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-aw-border bg-aw-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-aw-blue" />
              <span className="font-semibold">AgentWatch</span>
            </div>
            <p className="text-sm text-aw-text-secondary">
              AI Agent security auditing and real-time threat detection.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-aw-text-secondary">
              <li><a href="/dashboard" className="hover:text-aw-text">Dashboard</a></li>
              <li><a href="/reports" className="hover:text-aw-text">Reports</a></li>
              <li><a href="/settings" className="hover:text-aw-text">Settings</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-aw-text-secondary">
              <li><a href="#" className="hover:text-aw-text">Documentation</a></li>
              <li><a href="#" className="hover:text-aw-text">GitHub</a></li>
              <li><a href="#" className="hover:text-aw-text">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-aw-text-secondary">
              <li><a href="#" className="hover:text-aw-text">Privacy</a></li>
              <li><a href="#" className="hover:text-aw-text">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-aw-border pt-8 text-center text-sm text-aw-text-secondary">
          © 2026 AgentWatch. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
