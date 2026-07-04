import { useState, useRef, memo } from 'react';
import { Link } from 'react-router';
import { Copy, Check } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Hero Background                                                    */
/* ------------------------------------------------------------------ */
const HeroBackground = memo(function HeroBackground() {
  const particles = useRef(
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      size: 2 + (i % 3) * 1.5,
      delay: (i * 0.3) % 5,
      duration: 6 + (i % 4) * 2,
      opacity: 0.15 + (i % 3) * 0.08,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(41,121,255,0.06) 0%, rgba(123,97,255,0.03) 40%, transparent 100%)' }} />
      <div className="absolute inset-0 animate-grid-drift" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', width: '100%', height: '120%', top: '-20%' }} />
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full" style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: 'var(--accent-blue)', opacity: p.opacity, animation: `particle-drift-${(p.id % 3) + 1} ${p.duration}s ease-in-out infinite`, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
});

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  return <span className="tabular-nums" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{value}{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/*  Section: Hero                                                      */
/* ------------------------------------------------------------------ */
function HeroSection() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText('npm install agentwatch'); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const headlineWords = 'Secure Every MCP Tool Call. Monitor, Detect, Protect.'.split(' ');
  const coloredWords: Record<string, string> = { 'Monitor,': 'var(--accent-blue)', 'Detect,': 'var(--accent-amber)', 'Protect.': 'var(--accent-green)' };

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <HeroBackground />
      <div className="relative z-10 flex flex-col items-center text-center" style={{ maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2, ease: easeOutExpo }} className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium" style={{ color: 'var(--accent-blue)', borderColor: 'rgba(41,121,255,0.3)', letterSpacing: '0.02em' }}>
          AI Agent Security for MCP Tools
        </motion.div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.05]" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          {headlineWords.map((word, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: easeOutExpo }} className="inline-block mr-[0.3em]" style={{ color: coloredWords[word] || 'var(--text-primary)' }}>
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8, ease: easeSmooth }} className="mb-8 max-w-[640px] text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          AgentWatch audits every tool call your AI Agent makes through MCP. Real-time behavioral baselines, tamper-proof audit trails, and instant anomaly detection.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.0, ease: easeSmooth }} className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/auth?mode=register" className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:brightness-110" style={{ background: 'linear-gradient(135deg, #2979FF, #1E88E5)', boxShadow: '0 0 20px rgba(41,121,255,0.25)' }}>Start Monitoring Free</Link>
          <a href="https://docs.agentwatch.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-150" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}>View Documentation</a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.2, ease: easeSmooth }} className="mb-12 flex w-full max-w-md items-center justify-between rounded-lg border px-5 py-4" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-default)' }}>
          <code className="text-sm" style={{ color: 'var(--text-primary)', fontFamily: '"JetBrains Mono", monospace' }}>npm install agentwatch</code>
          <button onClick={handleCopy} className="ml-4 rounded-md p-1.5" style={{ color: 'var(--text-muted)' }} aria-label="Copy install command">
            <AnimatePresence mode="wait" initial={false}>
              {copied ? <motion.span key="check" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}><Check size={16} style={{ color: 'var(--accent-green)' }} /></motion.span>
                : <motion.span key="copy" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}><Copy size={16} /></motion.span>}
            </AnimatePresence>
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1.4, ease: easeOutExpo }} className="w-full max-w-[720px]">
          <img src="/hero-illustration.svg" alt="AgentWatch Security Visualization" className="animate-float mx-auto h-auto w-full" style={{ maxHeight: 400 }} />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Trust Stats Strip                                                  */
/* ------------------------------------------------------------------ */
const stats = [
  { value: '2.4B', suffix: '+', color: 'var(--accent-blue)', label: 'Calls Secured' },
  { value: '14.2M', suffix: '', color: 'var(--accent-red)', label: 'Anomalies Caught' },
  { value: '99.99', suffix: '%', color: 'var(--accent-green)', label: 'System Availability' },
  { value: '500K', suffix: '+', color: 'var(--accent-purple)', label: 'Reports Generated' },
];

function TrustStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <section ref={ref} className="w-full border-y" style={{ backgroundColor: 'var(--bg-darkest)', borderColor: 'var(--border-subtle)' }}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1, ease: easeOutExpo }} className="flex flex-col items-center text-center">
            <span className="text-2xl font-bold sm:text-3xl" style={{ color: stat.color, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '-0.02em' }}><AnimatedCounter value={stat.value} suffix={stat.suffix} /></span>
            <span className="mt-1 text-xs font-medium" style={{ color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features                                                           */
/* ------------------------------------------------------------------ */
const features = [
  { icon: '/feature-monitor.svg', title: 'Real-Time Call Monitoring', description: 'Every MCP tool call is intercepted, analyzed, and logged in real-time. Track call frequency, parameter changes, and response patterns as they happen.', accent: 'var(--accent-green)', glow: 'radial-gradient(circle at 50% 0%, rgba(0,212,170,0.06) 0%, transparent 60%)' },
  { icon: '/feature-baseline.svg', title: 'Behavioral Baseline Detection', description: "Build a 6-dimensional behavioral profile from your Agent's normal activity. Instantly detect deviations in call frequency, time patterns, tool diversity, and more.", accent: 'var(--accent-amber)', glow: 'radial-gradient(circle at 50% 0%, rgba(41,121,255,0.08) 0%, transparent 60%)' },
  { icon: '/feature-security.svg', title: 'HMAC Chain Verification', description: 'Every audit event is cryptographically linked using HMAC chains. Immutable, verifiable, and tamper-proof — your audit trail is as secure as a blockchain.', accent: 'var(--accent-purple)', glow: 'radial-gradient(circle at 50% 0%, rgba(41,121,255,0.08) 0%, transparent 60%)' },
  { icon: '/feature-report.svg', title: 'Audit Report Generation', description: 'Generate detailed security audit reports with one click. Export as PDF or JSON for compliance, debugging, or security reviews. Includes full behavioral analysis.', accent: 'var(--accent-blue)', glow: 'radial-gradient(circle at 50% 0%, rgba(41,121,255,0.08) 0%, transparent 60%)' },
];

function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.15 });
  return (
    <section id="features" className="w-full px-4 py-20 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="mx-auto max-w-[1200px]">
        <div ref={headerRef} className="mb-14 text-center">
          <motion.span initial={{ opacity: 0 }} animate={headerInView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }} className="mb-3 inline-block text-xs font-semibold uppercase" style={{ color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>WHY AGENTWATCH</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }} className="mb-4 text-3xl font-semibold tracking-tight sm:text-[32px]" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>Complete AI Agent Security</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2, ease: easeSmooth }} className="mx-auto max-w-[640px] text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Monitor every MCP tool call with behavioral baselines, real-time anomaly detection, and tamper-proof audit trails.</motion.p>
        </div>
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 40 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.12, ease: easeOutExpo }} className="group relative overflow-hidden rounded-xl border p-6 transition-all duration-200" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-subtle)', borderTop: `2px solid ${feature.accent}` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: feature.glow }} />
              <div className="relative z-10">
                <img src={feature.icon} alt={feature.title} className="mb-4 h-16 w-16" />
                <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */
const steps = [
  { num: '01', title: 'Install the AgentWatch SDK', description: 'Add AgentWatch to your AI Agent project with a single npm command. Works with any MCP-compatible framework.', code: 'npm install agentwatch' },
  { num: '02', title: 'Configure Your Baselines', description: "Set up behavioral baselines and anomaly thresholds for your Agent's MCP tool usage patterns. Customize detection sensitivity per tool." },
  { num: '03', title: 'Monitor & Respond', description: 'View real-time security dashboards, receive alerts on anomalies, and generate tamper-proof audit reports whenever you need them.' },
];

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <section id="how-it-works" ref={ref} className="w-full px-4 py-20 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="mx-auto max-w-[900px]">
        <div className="mb-14 text-center">
          <motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }} className="mb-3 inline-block text-xs font-semibold uppercase" style={{ color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>HOW IT WORKS</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }} className="text-3xl font-semibold tracking-tight sm:text-[32px]" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>Secure Your Agent in 3 Steps</motion.h2>
        </div>
        <div className="relative">
          <motion.div initial={{ scaleY: 0 }} animate={isInView ? { scaleY: 1 } : {}} transition={{ duration: 1, delay: 0.2, ease: easeSmooth }} className="absolute left-1/2 top-0 hidden h-full w-px origin-top -translate-x-1/2 md:block" style={{ backgroundColor: 'var(--border-default)' }} />
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={step.num} className="relative md:flex md:min-h-[200px] md:items-center">
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.2, ease: easeOutExpo }} className="absolute left-1/2 top-0 hidden h-3 w-3 -translate-x-1/2 rounded-full md:block" style={{ backgroundColor: 'var(--accent-blue)' }} />
                  <motion.div initial={{ opacity: 0, x: isLeft ? -30 : 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 + i * 0.2, ease: easeOutExpo }} className={`md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12 md:text-left'}`}>
                    <div className="mb-3 flex items-center gap-3 md:hidden">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold" style={{ color: 'var(--accent-blue)', borderColor: 'var(--border-default)', fontFamily: '"JetBrains Mono", monospace' }}>{step.num}</span>
                    </div>
                    <div className={`hidden md:mb-3 md:block ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border text-base font-semibold" style={{ color: 'var(--accent-blue)', borderColor: 'var(--border-default)', fontFamily: '"JetBrains Mono", monospace' }}>{step.num}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                    {step.code && <div className="mt-3 inline-block rounded-md px-3 py-1.5 text-xs" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: '"JetBrains Mono", monospace' }}>{step.code}</div>}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo Strip                                                         */
/* ------------------------------------------------------------------ */
function DemoStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const mockStats = [
    { label: 'Total Calls', value: '1,247', color: '#2979FF' },
    { label: 'Allowed', value: '1,198', color: '#00D4AA' },
    { label: 'Warned', value: '38', color: '#F5A623' },
    { label: 'Blocked', value: '11', color: '#FF4D4F' },
  ];
  const mockEvents = [
    { tool: 'filesystem.read', status: 'allowed', time: '2s ago' },
    { tool: 'database.query', status: 'allowed', time: '5s ago' },
    { tool: 'api.fetch', status: 'warned', time: '12s ago' },
    { tool: 'os.execute', status: 'blocked', time: '18s ago' },
  ];
  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    allowed: { bg: 'rgba(0,212,170,0.12)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.2)' },
    warned: { bg: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' },
    blocked: { bg: 'rgba(255,77,79,0.12)', color: '#FF4D4F', border: '1px solid rgba(255,77,79,0.2)' },
  };

  return (
    <section ref={ref} className="w-full border-t px-4 py-16 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-darkest)', borderColor: 'var(--border-subtle)' }}>
      <div className="mx-auto max-w-[1100px]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, ease: easeOutExpo }} className="overflow-hidden rounded-xl border" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#FF4D4F' }} />
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#F5A623' }} />
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#00D4AA' }} />
            <span className="ml-3 text-xs" style={{ color: 'var(--text-muted)', fontFamily: '"JetBrains Mono", monospace' }}>AgentWatch Dashboard</span>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {mockStats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }} className="rounded-lg border p-3" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  <p className="text-xl font-bold" style={{ color: s.color, fontFamily: '"JetBrains Mono", monospace' }}>{s.value}</p>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }} className="mb-6 rounded-lg border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="mb-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Risk Trend (24h)</p>
              <svg viewBox="0 0 600 80" className="h-20 w-full" preserveAspectRatio="none">
                <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2979FF" stopOpacity="0.3" /><stop offset="100%" stopColor="#2979FF" stopOpacity="0" /></linearGradient></defs>
                <motion.path d="M0,60 Q30,55 60,50 T120,45 T180,50 T240,35 T300,40 T360,30 T420,35 T480,25 T540,20 T600,15" fill="none" stroke="#2979FF" strokeWidth="2" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }} />
                <path d="M0,60 Q30,55 60,50 T120,45 T180,50 T240,35 T300,40 T360,30 T420,35 T480,25 T540,20 T600,15 L600,80 L0,80 Z" fill="url(#chartGrad)" opacity="0.5" />
                <line x1="0" y1="20" x2="600" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </svg>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.7 }}>
              <p className="mb-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Recent Events</p>
              <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
                {mockEvents.map((evt, i) => {
                  const sc = statusColors[evt.status];
                  return (
                    <div key={i} className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: i < mockEvents.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <span className="text-xs" style={{ color: 'var(--text-data)', fontFamily: '"JetBrains Mono", monospace' }}>{evt.tool}</span>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize" style={{ backgroundColor: sc.bg, color: sc.color, border: sc.border }}>{evt.status}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{evt.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */
const plans = [
  { name: 'Starter', badge: 'Free Forever', badgeStyle: { backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }, price: '$0', period: '/ month', description: 'Perfect for individual developers', borderColor: 'var(--border-default)', glow: 'none', features: ['Up to 1,000 tool calls/month', 'Real-time monitoring dashboard', 'Basic behavioral baselines', '7-day audit log retention', 'Community support'], cta: 'Get Started', ctaStyle: 'secondary' as const },
  { name: 'Pro', badge: 'Most Popular', badgeStyle: { backgroundColor: 'rgba(41,121,255,0.15)', color: 'var(--accent-blue)' }, price: '$29', period: '/ month', description: 'For production AI Agents', borderColor: 'rgba(41,121,255,0.3)', glow: 'radial-gradient(circle at 50% 0%, rgba(41,121,255,0.08) 0%, transparent 60%)', features: ['Up to 100,000 tool calls/month', 'Advanced behavioral baselines (6 dimensions)', 'Risk trend analytics', 'HMAC chain verification', '90-day audit log retention', 'PDF audit reports', 'Email alerts', 'Priority support'], cta: 'Start Pro Trial', ctaStyle: 'primary' as const },
  { name: 'Enterprise', badge: 'Custom', badgeStyle: { backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }, price: 'Custom', period: '', description: 'For teams and enterprises', borderColor: 'var(--border-default)', glow: 'none', features: ['Unlimited tool calls', 'Custom behavioral dimensions', 'Real-time team dashboards', 'Full audit trail (unlimited retention)', 'Advanced HMAC verification', 'Custom report templates', 'Webhook alerts + integrations', 'Dedicated support', 'SLA guarantee'], cta: 'Contact Sales', ctaStyle: 'secondary' as const },
];

function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <section id="pricing" ref={ref} className="w-full px-4 py-20 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-14 text-center">
          <motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }} className="mb-3 inline-block text-xs font-semibold uppercase" style={{ color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>PRICING</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }} className="mb-3 text-3xl font-semibold tracking-tight sm:text-[32px]" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>Choose Your Security Level</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2, ease: easeSmooth }} className="text-base" style={{ color: 'var(--text-secondary)' }}>Start free, scale as your Agent grows.</motion.p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15, ease: easeOutExpo }} className="relative flex flex-col overflow-hidden rounded-xl border p-6 transition-all duration-200" style={{ backgroundColor: 'var(--bg-base)', borderColor: plan.borderColor }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {plan.glow !== 'none' && <div className="pointer-events-none absolute inset-0" style={{ background: plan.glow }} />}
              <div className="relative z-10 flex flex-1 flex-col">
                <span className="mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-semibold uppercase" style={plan.badgeStyle}>{plan.badge}</span>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{plan.price}</span>
                  {plan.period && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>}
                </div>
                <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Check size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-green)' }} />{f}
                    </li>
                  ))}
                </ul>
                {plan.ctaStyle === 'primary' ? (
                  <Link to="/auth?mode=register" className="block w-full rounded-lg py-2.5 text-center text-sm font-semibold text-white transition-all duration-150 hover:brightness-110" style={{ background: 'linear-gradient(135deg, #2979FF, #1E88E5)', boxShadow: '0 0 20px rgba(41,121,255,0.25)' }}>{plan.cta}</Link>
                ) : (
                  <Link to="/auth?mode=register" className="block w-full rounded-lg border py-2.5 text-center text-sm font-medium transition-all duration-150" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}>{plan.cta}</Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Home Page                                                          */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturesSection />
      <HowItWorksSection />
      <DemoStrip />
      <PricingSection />
    </>
  );
}
