import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud,
  Key,
  Shield,
  User,
  ChevronRight,
  Save,
  TestTube,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Download,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

type TabId = 'cloud' | 'apikeys' | 'privacy' | 'account';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'cloud', label: 'Cloud Upload', icon: Cloud },
  { id: 'apikeys', label: 'API Keys', icon: Key },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'account', label: 'Account', icon: User },
];

function CloudPanel() {
  const [endpoint, setEndpoint] = useState('https://api.agentwatch.dev/v1/upload');
  const [batchSize, setBatchSize] = useState(100);
  const [interval, setInterval] = useState(300);
  const [retries, setRetries] = useState(3);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'none' | 'success' | 'fail'>('none');

  const handleTest = () => {
    setTesting(true);
    setTestResult('none');
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Cloud Upload Configuration</h3>
          <p className="text-sm text-slate-500 mt-1">Configure how audit data is uploaded to the cloud</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#2979FF] to-[#7B61FF] hover:shadow-lg hover:shadow-[#2979FF]/20 transition-all">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <label className="block text-sm font-medium text-slate-300 mb-2">Upload Endpoint</label>
        <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
        <p className="text-xs text-slate-600 mt-2">The URL where encrypted audit batches are uploaded</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Batch Size</label>
          <input type="number" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <p className="text-xs text-slate-600 mt-2">Events per batch</p>
        </div>
        <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Upload Interval (s)</label>
          <input type="number" value={interval} onChange={(e) => setInterval(Number(e.target.value))} className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <p className="text-xs text-slate-600 mt-2">Seconds between uploads</p>
        </div>
        <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Max Retries</label>
          <input type="number" value={retries} onChange={(e) => setRetries(Number(e.target.value))} className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <p className="text-xs text-slate-600 mt-2">Retry attempts</p>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-white">Connection Test</h4>
            <p className="text-xs text-slate-500 mt-1">Verify your endpoint is reachable</p>
          </div>
          <button onClick={handleTest} disabled={testing} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all" style={{ background: testing ? 'rgba(255,255,255,0.05)' : 'rgba(41,121,255,0.15)', color: testing ? '#9CA3AF' : '#2979FF', border: '1px solid rgba(41,121,255,0.2)' }}>
            {testing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
        {testResult === 'success' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.2)' }}>
            Connection successful! Endpoint is reachable and accepting data.
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ApiKeysPanel() {
  const [keys, setKeys] = useState([
    { id: '1', name: 'Production Key', key: 'aw_prod_••••••••••••••••••••••••', created: '2025-01-15', lastUsed: '2 hours ago', scopes: ['upload', 'read'] },
    { id: '2', name: 'Development Key', key: 'aw_dev_••••••••••••••••••••••••', created: '2025-02-01', lastUsed: '1 day ago', scopes: ['upload'] },
  ]);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const toggleReveal = (id: string) => setRevealed((p) => ({ ...p, [id]: !p[id] }));
  const copyKey = (id: string, fullKey: string) => {
    navigator.clipboard.writeText(fullKey);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 1500);
  };
  const revokeKey = (id: string) => setKeys((p) => p.filter((k) => k.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">API Keys</h3>
          <p className="text-sm text-slate-500 mt-1">Manage API keys for programmatic access</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#2979FF] to-[#7B61FF] hover:shadow-lg hover:shadow-[#2979FF]/20 transition-all">
          <Key className="h-4 w-4" />
          Create New Key
        </button>
      </div>
      <div className="space-y-3">
        {keys.map((k) => (
          <motion.div key={k.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-5 hover:bg-white/[0.02]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(41,121,255,0.1)' }}>
                  <Key className="h-4 w-4 text-[#2979FF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{k.name}</p>
                  <p className="text-xs text-slate-500">Created {k.created} · Last used {k.lastUsed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleReveal(k.id)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                  {revealed[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button onClick={() => copyKey(k.id, k.key)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                  {copied[k.id] ? <Check className="h-4 w-4 text-[#00D4AA]" /> : <Copy className="h-4 w-4" />}
                </button>
                <button onClick={() => revokeKey(k.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg px-3 py-2 text-xs font-mono text-slate-400" style={{ background: 'rgba(0,0,0,0.2)', fontFamily: '"JetBrains Mono", monospace' }}>
                {revealed[k.id] ? k.key.replace(/•/g, 'x') : k.key}
              </code>
              {k.scopes.map((s) => (
                <span key={s} className="px-2 py-1 rounded-md text-xs font-medium capitalize" style={{ background: 'rgba(41,121,255,0.1)', color: '#2979FF' }}>
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PrivacyPanel() {
  const [retention, setRetention] = useState(90);
  const [redactionEnabled, setRedactionEnabled] = useState(true);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
        <p className="text-sm text-slate-500 mt-1">Control data retention and PII handling</p>
      </div>
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <label className="block text-sm font-medium text-slate-300 mb-3">Data Retention (days)</label>
        <input type="range" min={7} max={365} value={retention} onChange={(e) => setRetention(Number(e.target.value))} className="w-full accent-[#2979FF]" />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-600">7 days</span>
          <span className="text-sm font-medium text-[#2979FF]">{retention} days</span>
          <span className="text-xs text-slate-600">365 days</span>
        </div>
      </div>
      <div className="rounded-xl p-5 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p className="text-sm font-medium text-white">PII Redaction</p>
          <p className="text-xs text-slate-500 mt-1">Automatically redact personally identifiable information</p>
        </div>
        <button onClick={() => setRedactionEnabled(!redactionEnabled)} className={`relative h-6 w-11 rounded-full transition-colors ${redactionEnabled ? 'bg-[#2979FF]' : 'bg-slate-700'}`}>
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${redactionEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 className="text-sm font-medium text-white mb-3">Data Export</h4>
        <p className="text-xs text-slate-500 mb-4">Download all your audit data in JSON format</p>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#2979FF] hover:bg-[#2979FF]/10 transition-colors" style={{ border: '1px solid rgba(41,121,255,0.2)' }}>
          <Download className="h-4 w-4" />
          Export All Data
        </button>
      </div>
    </div>
  );
}

function AccountPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Account Settings</h3>
        <p className="text-sm text-slate-500 mt-1">Manage your profile and preferences</p>
      </div>
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 className="text-sm font-medium text-white mb-4">Profile</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Display Name</label>
            <input type="text" defaultValue="Agent Operator" className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Email</label>
            <input type="email" defaultValue="operator@example.com" className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 className="text-sm font-medium text-white mb-4">Connected Wallets</h4>
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2979FF] to-[#7B61FF] flex items-center justify-center">
            <span className="text-xs font-bold text-white">0x</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-mono">0x7a25...3f91</p>
            <p className="text-xs text-slate-500">MetaMask · Connected</p>
          </div>
          <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Disconnect</button>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,77,79,0.05)', border: '1px solid rgba(255,77,79,0.15)' }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-[#FF4D4F]" />
          <h4 className="text-sm font-medium text-[#FF4D4F]">Danger Zone</h4>
        </div>
        <p className="text-xs text-slate-500 mb-4">Once you delete your account, there is no going back.</p>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#FF4D4F] hover:bg-[#FF4D4F]/10 transition-colors" style={{ border: '1px solid rgba(255,77,79,0.2)' }}>
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('cloud');
  return (
    <DashboardLayout>
      <div className="pointer-events-none fixed inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(123,97,255,0.03) 0%, transparent 70%)', zIndex: 0 }} />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="relative z-10 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '24px' }}>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Configure your AgentWatch instance</p>
      </motion.div>
      <div className="relative z-10 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${activeTab === tab.id ? 'text-[#2979FF] bg-[#2979FF]/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'}`}>
                  <Icon className="h-4 w-4" />{tab.label}<ChevronRight className={`h-4 w-4 ml-auto ${activeTab === tab.id ? 'text-[#2979FF]' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>
        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="flex-1 min-w-0">
          {activeTab === 'cloud' && <CloudPanel />}
          {activeTab === 'apikeys' && <ApiKeysPanel />}
          {activeTab === 'privacy' && <PrivacyPanel />}
          {activeTab === 'account' && <AccountPanel />}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
