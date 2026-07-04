import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Wallet,
  ShieldCheck,
  Check,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

// ── Supabase Client ──────────────────────────────────────────────
const supabaseUrl = 'https://kbjcikgoawxhotwwqtin.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiamNpa2dvYXd4aG90d3dxdGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzU4NzcsImV4cCI6MjA5ODc1MTg3N30.msWhe0oqAf_lmQoHOE5BmrMTDNevRls0qjUA-vnqfYQ'
const supabase = createClient(supabaseUrl, supabaseKey)

// ── Types ────────────────────────────────────────────────────────
type AuthView = 'signin' | 'signup' | 'reset'
type WalletOption = {
  id: string
  name: string
  icon: React.ReactNode
}

// ── Easing Constants ─────────────────────────────────────────────
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]
const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number]

// ── Color Tokens ─────────────────────────────────────────────────
const C = {
  bgDarkest: '#0A0B0E',
  bgDark: '#0D0E12',
  bgBase: '#111216',
  bgElevated: '#16181F',
  bgHover: '#1A1D26',
  bgInput: '#14161E',
  borderSubtle: 'rgba(255,255,255,0.04)',
  borderDefault: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.10)',
  accentBlue: '#2979FF',
  accentGreen: '#00D4AA',
  accentAmber: '#F5A623',
  accentRed: '#FF4D4F',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#5C6270',
}

// ── Particle Network Canvas ──────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const particles: { x: number; y: number; vx: number; vy: number }[] = []
    const PARTICLE_COUNT = 70
    const CONNECTION_DIST = 100
    const PARTICLE_COLOR = 'rgba(41,121,255,0.2)'
    const LINE_COLOR_BASE = 'rgba(41,121,255,'

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      canvas!.width = w * window.devicePixelRatio
      canvas!.height = h * window.devicePixelRatio
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    function initParticles() {
      particles.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
        })
      }
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = PARTICLE_COLOR
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.08
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = LINE_COLOR_BASE + alpha + ')'
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    resize()
    initParticles()
    draw()

    window.addEventListener('resize', () => {
      resize()
      initParticles()
    })

    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}

// ── Password Strength Indicator ──────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }, [password])

  if (!password) return null

  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = [C.accentRed, C.accentAmber, '#2979FF', C.accentGreen]

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: i <= strength ? colors[strength - 1] : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>
      <p
        className="mt-1 text-xs font-medium"
        style={{ color: colors[strength - 1] }}
      >
        {labels[strength - 1]}
      </p>
    </div>
  )
}

// ── Wallet Icons (SVG) ───────────────────────────────────────────
function MetaMaskIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
function WalletConnectIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M6.37 12.1c4.13-4.04 10.13-4.04 14.26 0l.47.46a.48.48 0 0 0 .68 0l.47-.46c.18-.18.18-.48 0-.66-4.6-4.5-11.05-4.5-15.65 0-.18.18-.18.48 0 .66l.47.46c.19.18.49.18.68 0l.62-.46z" fill="#3B99FC"/>
      <path d="M18.94 13.52c-3.44-3.36-8.44-3.36-11.88 0l-.47.46a.48.48 0 0 1-.68 0l-.47-.46a.485.485 0 0 1 0-.68l.62-.46c4.03-3.94 9.56-3.94 13.59 0l.62.46c.18.18.18.48 0 .66l-.47.46a.48.48 0 0 1-.68 0l-.18-.48z" fill="#3B99FC"/>
      <path d="M16.31 16.07c-1.98-1.93-4.84-1.93-6.82 0l-.62.46-1.55 1.46c-.18.18-.18.48 0 .66l.47.46c.19.18.49.18.68 0l1.55-1.46c1.28-1.25 3.08-1.25 4.36 0l1.55 1.46c.19.18.49.18.68 0l.47-.46c.18-.18.18-.48 0-.66l-1.71-1.42z" fill="#3B99FC"/>
    </svg>
  )
}
function CoinbaseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#0052FF"/>
      <path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5c2.39 0 4.38 1.69 4.88 3.94h4.96C21.2 5.97 17.03 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c5.03 0 9.2-2.97 10.84-6.94h-4.96C16.38 15.31 14.39 17 12 17z" fill="#0052FF"/>
      <path d="M8.5 12a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" fill="white"/>
    </svg>
  )
}
function PhantomIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#AB9FF2"/>
      <path d="M12.7 5.5c-3.97 0-7.5 2.5-8.7 6.2-.1.3.2.5.4.4.7-.4 1.6-.5 2.4-.2 1 .3 1.7 1.1 2.1 2 .1.3.5.4.7.2.7-.7 1.8-1 2.8-.6.6.2 1 .7 1.3 1.2.2.3.6.3.8.1 1.3-1.2 3.1-1.6 4.7-1 .3.1.5-.2.4-.5-1-3.4-4.2-5.8-8.1-5.8z" fill="white"/>
      <path d="M7.5 14c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" fill="white"/>
    </svg>
  )
}

// ── Main Auth Page ───────────────────────────────────────────────
export default function Auth() {
  const [view, setView] = useState<AuthView>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const [walletLoading, setWalletLoading] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({})

  const wallets: WalletOption[] = [
    { id: 'metamask', name: 'MetaMask', icon: <MetaMaskIcon /> },
    { id: 'walletconnect', name: 'WalletConnect', icon: <WalletConnectIcon /> },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: <CoinbaseIcon /> },
    { id: 'phantom', name: 'Phantom', icon: <PhantomIcon /> },
  ]

  // ── Validation ─────────────────────────────────────────────────
  const validateEmail = useCallback((val: string) => {
    if (!val) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Invalid email format'
    return ''
  }, [])

  const validatePassword = useCallback((val: string) => {
    if (!val) return 'Password is required'
    if (val.length < 8) return 'Minimum 8 characters'
    return ''
  }, [])

  const validateConfirmPassword = useCallback(
    (val: string) => {
      if (!val) return 'Please confirm your password'
      if (val !== password) return 'Passwords do not match'
      return ''
    },
    [password]
  )

  // ── Handlers ───────────────────────────────────────────────────
  const handleBlur = (field: string) => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSignIn = async () => {
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    setFieldErrors({ email: emailErr, password: passErr })
    setFieldTouched({ email: true, password: true })
    if (emailErr || passErr) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message, {
        icon: <AlertTriangle className="size-4" />,
      })
    } else {
      toast.success('Signed in successfully!', {
        icon: <Check className="size-4" />,
      })
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 800)
    }
  }

  const handleSignUp = async () => {
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    const confirmErr = validateConfirmPassword(confirmPassword)
    const errors: Record<string, string> = {
      email: emailErr,
      password: passErr,
      confirmPassword: confirmErr,
    }
    if (!agreedToTerms) {
      errors.terms = 'You must agree to the terms'
    }
    setFieldErrors(errors)
    setFieldTouched({
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    })
    if (emailErr || passErr || confirmErr || !agreedToTerms) return

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message, {
        icon: <AlertTriangle className="size-4" />,
      })
    } else {
      toast.success('Account created! Please check your email to verify.', {
        icon: <Check className="size-4" />,
      })
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 800)
    }
  }

  const handleResetPassword = async () => {
    const emailErr = validateEmail(email)
    setFieldErrors({ email: emailErr })
    setFieldTouched({ email: true })
    if (emailErr) return

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message, {
        icon: <AlertTriangle className="size-4" />,
      })
    } else {
      toast.success('Password reset link sent! Check your email.', {
        icon: <Check className="size-4" />,
      })
      setView('signin')
    }
  }

  const handleWalletConnect = async (walletId: string) => {
    setWalletLoading(walletId)
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setWalletLoading(null)
    setWalletOpen(false)
    toast.success('Wallet connected successfully!', {
      icon: <Check className="size-4" />,
    })
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 800)
  }

  // ── Render helpers ─────────────────────────────────────────────
  const inputBaseStyle: React.CSSProperties = {
    backgroundColor: C.bgInput,
    border: '1px solid ' + C.borderSubtle,
    color: C.textPrimary,
  }

  const getInputBorder = (fieldName: string) => {
    if (fieldTouched[fieldName] && fieldErrors[fieldName]) {
      return '1px solid ' + C.accentRed
    }
    return undefined
  }

  // ── JSX ────────────────────────────────────────────────────────
  return (
    <div
      className="flex min-h-[100dvh] w-full"
      style={{ backgroundColor: C.bgDark }}
    >
      {/* ═══════ LEFT PANEL ═══════ */}
      <div
        className="relative hidden overflow-hidden lg:flex"
        style={{
          width: '45%',
          backgroundColor: C.bgDarkest,
        }}
      >
        {/* Particle network */}
        <ParticleCanvas />

        {/* Radial gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(41,121,255,0.06) 0%, transparent 70%)',
            zIndex: 1,
          }}
        />

        {/* Faint grid pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            zIndex: 1,
          }}
        />

        {/* Logo */}
        <motion.div
          className="absolute top-10 left-10 flex items-center gap-3"
          style={{ zIndex: 2 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: 'rgba(41,121,255,0.12)' }}
          >
            <ShieldCheck
              className="size-6"
              style={{ color: C.accentBlue }}
            />
          </div>
          <span
            className="text-lg font-semibold tracking-wide"
            style={{ color: C.textPrimary, letterSpacing: '0.08em' }}
          >
            AGENTWATCH
          </span>
        </motion.div>

        {/* Quote section */}
        <div className="absolute bottom-12 left-12 max-w-[400px]" style={{ zIndex: 2 }}>
          <motion.blockquote
            className="text-base italic leading-relaxed"
            style={{ color: C.textSecondary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: easeOutExpo }}
          >
            &ldquo;AgentWatch caught an unauthorized tool call pattern within hours of
            deployment. It saved our production system from a potential data
            leak.&rdquo;
          </motion.blockquote>

          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: easeOutExpo }}
          >
            <p
              className="text-base font-semibold"
              style={{ color: C.textPrimary }}
            >
              Sarah Chen
            </p>
            <p
              className="mt-0.5 text-xs font-medium"
              style={{ color: C.textMuted, letterSpacing: '0.02em' }}
            >
              Lead AI Engineer, Nexus Labs
            </p>
          </motion.div>
        </div>

        {/* Security badge */}
        <motion.div
          className="absolute right-10 bottom-12 flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            border: '1px solid ' + C.borderSubtle,
            color: C.textMuted,
            zIndex: 2,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9, ease: easeOutExpo }}
        >
          <ShieldCheck className="size-3.5" />
          <span className="text-xs font-medium" style={{ letterSpacing: '0.02em' }}>
            SOC 2 Type II Certified
          </span>
        </motion.div>
      </div>

      {/* ═══════ RIGHT PANEL ═══════ */}
      <div
        className="flex flex-1 items-center justify-center px-6 py-8 sm:px-12"
        style={{ backgroundColor: C.bgDark }}
      >
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'rgba(41,121,255,0.12)' }}
            >
              <ShieldCheck className="size-6" style={{ color: C.accentBlue }} />
            </div>
            <span
              className="text-lg font-semibold"
              style={{ color: C.textPrimary, letterSpacing: '0.08em' }}
            >
              AGENTWATCH
            </span>
          </div>

          {/* Tab switcher */}
          <AnimatePresence mode="wait">
            {view !== 'reset' && (
              <motion.div
                className="mb-8 flex"
                style={{
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: easeSmooth }}
              >
                <button
                  onClick={() => {
                    setView('signin')
                    setFieldErrors({})
                    setFieldTouched({})
                  }}
                  className="flex-1 py-2.5 text-sm font-medium transition-all duration-200"
                  style={{
                    borderRadius: 8,
                    borderBottom:
                      view === 'signin'
                        ? '2px solid ' + C.accentBlue
                        : '2px solid transparent',
                    backgroundColor:
                      view === 'signin' ? C.bgElevated : 'transparent',
                    color: view === 'signin' ? C.textPrimary : C.textSecondary,
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setView('signup')
                    setFieldErrors({})
                    setFieldTouched({})
                  }}
                  className="flex-1 py-2.5 text-sm font-medium transition-all duration-200"
                  style={{
                    borderRadius: 8,
                    borderBottom:
                      view === 'signup'
                        ? '2px solid ' + C.accentBlue
                        : '2px solid transparent',
                    backgroundColor:
                      view === 'signup' ? C.bgElevated : 'transparent',
                    color: view === 'signup' ? C.textPrimary : C.textSecondary,
                  }}
                >
                  Create Account
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Form Content ── */}
          <AnimatePresence mode="wait">
            {/* ━━━ Sign In ━━━ */}
            {view === 'signin' && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: easeSmooth }}
              >
                <h1
                  className="text-[32px] font-semibold leading-tight"
                  style={{
                    color: C.textPrimary,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Welcome back
                </h1>
                <p
                  className="mt-2 text-sm"
                  style={{ color: C.textSecondary }}
                >
                  Sign in to your AgentWatch dashboard
                </p>

                <div className="mt-8 space-y-5">
                  {/* Email */}
                  <div className="relative">
                    <Mail
                      className="absolute top-1/2 left-3 size-4 -translate-y-1/2"
                      style={{ color: C.textMuted }}
                    />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (fieldTouched.email) {
                          setFieldErrors((p) => ({
                            ...p,
                            email: validateEmail(e.target.value),
                          }))
                        }
                      }}
                      onBlur={() => handleBlur('email')}
                      className="h-11 pl-10 pr-4"
                      style={{
                        ...inputBaseStyle,
                        border: getInputBorder('email') ?? inputBaseStyle.border,
                      }}
                    />
                    {fieldTouched.email && !fieldErrors.email && email && (
                      <Check
                        className="absolute top-1/2 right-3 size-4 -translate-y-1/2"
                        style={{ color: C.accentGreen }}
                      />
                    )}
                    {fieldTouched.email && fieldErrors.email && (
                      <p
                        className="mt-1 text-xs font-medium"
                        style={{ color: C.accentRed }}
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock
                      className="absolute top-1/2 left-3 size-4 -translate-y-1/2"
                      style={{ color: C.textMuted }}
                    />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (fieldTouched.password) {
                          setFieldErrors((p) => ({
                            ...p,
                            password: validatePassword(e.target.value),
                          }))
                        }
                      }}
                      onBlur={() => handleBlur('password')}
                      className="h-11 pl-10 pr-10"
                      style={{
                        ...inputBaseStyle,
                        border:
                          getInputBorder('password') ?? inputBaseStyle.border,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" style={{ color: C.textMuted }} />
                      ) : (
                        <Eye className="size-4" style={{ color: C.textMuted }} />
                      )}
                    </button>
                    {fieldTouched.password && fieldErrors.password && (
                      <p
                        className="mt-1 text-xs font-medium"
                        style={{ color: C.accentRed }}
                      >
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Forgot password */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setView('reset')
                        setFieldErrors({})
                        setFieldTouched({})
                      }}
                      className="text-sm transition-colors hover:underline"
                      style={{ color: C.accentBlue }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In button */}
                  <Button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="h-11 w-full text-sm font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #2979FF, #1E88E5)',
                      color: '#FFFFFF',
                      borderRadius: 8,
                    }}
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1" style={{ backgroundColor: C.borderDefault }} />
                  <span
                    className="text-xs font-medium"
                    style={{ color: C.textMuted, letterSpacing: '0.02em' }}
                  >
                    or continue with
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: C.borderDefault }} />
                </div>

                {/* Wallet button */}
                <Button
                  onClick={() => setWalletOpen(true)}
                  variant="outline"
                  className="h-11 w-full gap-2 text-sm font-medium"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid ' + C.borderDefault,
                    color: C.textSecondary,
                    borderRadius: 8,
                  }}
                >
                  <Wallet className="size-4" />
                  Connect Crypto Wallet
                </Button>
              </motion.div>
            )}

            {/* ━━━ Create Account ━━━ */}
            {view === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: easeSmooth }}
              >
                <h1
                  className="text-[32px] font-semibold leading-tight"
                  style={{ color: C.textPrimary, letterSpacing: '-0.02em' }}
                >
                  Create your account
                </h1>
                <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
                  Start monitoring your AI Agent in minutes
                </p>

                <div className="mt-8 space-y-5">
                  {/* Email */}
                  <div className="relative">
                    <Mail
                      className="absolute top-1/2 left-3 size-4 -translate-y-1/2"
                      style={{ color: C.textMuted }}
                    />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (fieldTouched.email) {
                          setFieldErrors((p) => ({
                            ...p,
                            email: validateEmail(e.target.value),
                          }))
                        }
                      }}
                      onBlur={() => handleBlur('email')}
                      className="h-11 pl-10 pr-4"
                      style={{
                        ...inputBaseStyle,
                        border: getInputBorder('email') ?? inputBaseStyle.border,
                      }}
                    />
                    {fieldTouched.email && !fieldErrors.email && email && (
                      <Check
                        className="absolute top-1/2 right-3 size-4 -translate-y-1/2"
                        style={{ color: C.accentGreen }}
                      />
                    )}
                    {fieldTouched.email && fieldErrors.email && (
                      <p
                        className="mt-1 text-xs font-medium"
                        style={{ color: C.accentRed }}
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="relative">
                      <Lock
                        className="absolute top-1/2 left-3 size-4 -translate-y-1/2"
                        style={{ color: C.textMuted }}
                      />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (fieldTouched.password) {
                            setFieldErrors((p) => ({
                              ...p,
                              password: validatePassword(e.target.value),
                            }))
                          }
                        }}
                        onBlur={() => handleBlur('password')}
                        className="h-11 pl-10 pr-10"
                        style={{
                          ...inputBaseStyle,
                          border:
                            getInputBorder('password') ??
                            inputBaseStyle.border,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" style={{ color: C.textMuted }} />
                        ) : (
                          <Eye className="size-4" style={{ color: C.textMuted }} />
                        )}
                      </button>
                    </div>
                    <PasswordStrength password={password} />
                    {fieldTouched.password && fieldErrors.password && (
                      <p
                        className="mt-1 text-xs font-medium"
                        style={{ color: C.accentRed }}
                      >
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <Lock
                      className="absolute top-1/2 left-3 size-4 -translate-y-1/2"
                      style={{ color: C.textMuted }}
                    />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (fieldTouched.confirmPassword) {
                          setFieldErrors((p) => ({
                            ...p,
                            confirmPassword: validateConfirmPassword(e.target.value),
                          }))
                        }
                      }}
                      onBlur={() => handleBlur('confirmPassword')}
                      className="h-11 pl-10 pr-10"
                      style={{
                        ...inputBaseStyle,
                        border:
                          getInputBorder('confirmPassword') ??
                          inputBaseStyle.border,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" style={{ color: C.textMuted }} />
                      ) : (
                        <Eye className="size-4" style={{ color: C.textMuted }} />
                      )}
                    </button>
                    {fieldTouched.confirmPassword && fieldErrors.confirmPassword && (
                      <p
                        className="mt-1 text-xs font-medium"
                        style={{ color: C.accentRed }}
                      >
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => {
                        setAgreedToTerms(checked === true)
                        if (fieldTouched.terms && checked) {
                          setFieldErrors((p) => ({ ...p, terms: '' }))
                        }
                      }}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>
                      I agree to the{' '}
                      <span style={{ color: C.accentBlue }}>Terms of Service</span> and{' '}
                      <span style={{ color: C.accentBlue }}>Privacy Policy</span>
                    </label>
                  </div>
                  {fieldTouched.terms && fieldErrors.terms && (
                    <p className="-mt-3 text-xs font-medium" style={{ color: C.accentRed }}>
                      {fieldErrors.terms}
                    </p>
                  )}

                  {/* Create Account button */}
                  <Button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="h-11 w-full text-sm font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #2979FF, #1E88E5)',
                      color: '#FFFFFF',
                      borderRadius: 8,
                    }}
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1" style={{ backgroundColor: C.borderDefault }} />
                  <span
                    className="text-xs font-medium"
                    style={{ color: C.textMuted, letterSpacing: '0.02em' }}
                  >
                    or continue with
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: C.borderDefault }} />
                </div>

                {/* Wallet button */}
                <Button
                  onClick={() => setWalletOpen(true)}
                  variant="outline"
                  className="h-11 w-full gap-2 text-sm font-medium"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid ' + C.borderDefault,
                    color: C.textSecondary,
                    borderRadius: 8,
                  }}
                >
                  <Wallet className="size-4" />
                  Connect Crypto Wallet
                </Button>
              </motion.div>
            )}

            {/* ━━━ Reset Password ━━━ */}
            {view === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeSmooth }}
              >
                <button
                  onClick={() => {
                    setView('signin')
                    setFieldErrors({})
                    setFieldTouched({})
                  }}
                  className="mb-6 flex items-center gap-2 text-sm transition-colors hover:underline"
                  style={{ color: C.accentBlue }}
                >
                  <ArrowLeft className="size-4" />
                  Back to Sign In
                </button>

                <h1
                  className="text-[32px] font-semibold leading-tight"
                  style={{ color: C.textPrimary, letterSpacing: '-0.02em' }}
                >
                  Reset your password
                </h1>
                <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
                  Enter your email and we&apos;ll send you a reset link
                </p>

                <div className="mt-8 space-y-5">
                  <div className="relative">
                    <Mail
                      className="absolute top-1/2 left-3 size-4 -translate-y-1/2"
                      style={{ color: C.textMuted }}
                    />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (fieldTouched.email) {
                          setFieldErrors((p) => ({
                            ...p,
                            email: validateEmail(e.target.value),
                          }))
                        }
                      }}
                      onBlur={() => handleBlur('email')}
                      className="h-11 pl-10 pr-4"
                      style={{
                        ...inputBaseStyle,
                        border: getInputBorder('email') ?? inputBaseStyle.border,
                      }}
                    />
                    {fieldTouched.email && fieldErrors.email && (
                      <p
                        className="mt-1 text-xs font-medium"
                        style={{ color: C.accentRed }}
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="h-11 w-full text-sm font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #2979FF, #1E88E5)',
                      color: '#FFFFFF',
                      borderRadius: 8,
                    }}
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ═══════ WALLET CONNECT MODAL ═══════ */}
      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogContent
          className="gap-0 border-0 p-0 sm:max-w-md"
          style={{
            backgroundColor: C.bgElevated,
            border: '1px solid ' + C.borderDefault,
            borderRadius: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: easeOutExpo }}
          >
            <DialogHeader className="p-6 pb-4">
              <DialogTitle
                className="text-xl font-semibold"
                style={{ color: C.textPrimary }}
              >
                Connect Your Wallet
              </DialogTitle>
              <DialogDescription style={{ color: C.textSecondary }}>
                Choose a wallet to connect to your AgentWatch account
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 p-6 pt-0">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletConnect(wallet.id)}
                  className="flex items-center gap-4 rounded-lg px-4 py-3.5 text-left transition-all duration-150 hover:brightness-110"
                  style={{
                    backgroundColor: C.bgBase,
                    border: '1px solid ' + C.borderSubtle,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.borderHover
                    e.currentTarget.style.backgroundColor = C.bgHover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.borderSubtle
                    e.currentTarget.style.backgroundColor = C.bgBase
                  }}
                >
                  {wallet.icon}
                  <span
                    className="flex-1 text-sm font-medium"
                    style={{ color: C.textPrimary }}
                  >
                    {wallet.name}
                  </span>
                  {walletLoading === wallet.id ? (
                    <Loader2
                      className="size-4 animate-spin"
                      style={{ color: C.textMuted }}
                    />
                  ) : (
                    <ArrowLeft
                      className="size-4 rotate-180"
                      style={{ color: C.textMuted }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}