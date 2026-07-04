import { Link } from 'react-router';
import { Shield, Github, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#060910]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2979FF] to-[#7B61FF]">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">
                Agent<span className="text-[#2979FF]">Watch</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI Agent security auditing and risk monitoring platform. Protect your agents with real-time oversight.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2.5">
              <li><Link to="/dashboard" className="text-sm text-slate-500 hover:text-[#2979FF] transition-colors">Dashboard</Link></li>
              <li><Link to="/reports" className="text-sm text-slate-500 hover:text-[#2979FF] transition-colors">Reports</Link></li>
              <li><Link to="/settings" className="text-sm text-slate-500 hover:text-[#2979FF] transition-colors">Settings</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2979FF] transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2979FF] transition-colors">API Reference</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2979FF] transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Community</h3>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#2979FF] hover:bg-[#2979FF]/10 transition-all">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#2979FF] hover:bg-[#2979FF]/10 transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#2979FF] hover:bg-[#2979FF]/10 transition-all">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2025 AgentWatch. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
