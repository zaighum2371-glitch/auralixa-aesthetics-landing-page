'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data?.user) {
        // Query user's profile to inspect role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', data.user.id)
          .single()

        if (profile?.status === 'banned' || profile?.status === 'suspended') {
          await supabase.auth.signOut()
          setError('Your account is currently restricted. Please contact clinic management.')
          setLoading(false)
          return
        }

        // Redirect based on role or original destination
        if (redirectTo) {
          router.push(redirectTo)
        } else if (profile?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during sign in.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-sm">
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-medium">
          Welcome Back
        </h1>
        <p className="text-sm text-foreground/70 mt-1">
          Sign in to access your clinic portal and appointments
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-lg font-medium transition-all shadow-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </span>
          ) : (
            'Sign In to Portal'
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border/60 text-center">
        <p className="text-sm text-foreground/70">
          New to Auralixa?{' '}
          <Link
            href="/signup"
            className="text-foreground font-medium underline underline-offset-4 hover:text-gold transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-card border border-border/80 rounded-2xl p-8 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
