'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAvatarSignedUrl } from '@/lib/supabase/avatar'
import { User, LogOut, LayoutDashboard, Shield, Sparkles, ChevronDown } from 'lucide-react'

interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: 'user' | 'client' | 'admin'
  email: string | null
}

export function UserProfileMenu() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setProfile(null)
          setLoading(false)
          return
        }

        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, role, email')
          .eq('id', user.id)
          .single()

        if (data) {
          let resolvedAvatarUrl = data.avatar_url
          if (data.avatar_url) {
            resolvedAvatarUrl = await getAvatarSignedUrl(supabase, data.avatar_url)
          }

          setProfile({
            ...data,
            avatar_url: resolvedAvatarUrl,
            email: data.email || user.email || null,
          })
        }
      } catch (err) {
        console.error('Failed to load user profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    setProfile(null)
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted/60 animate-pulse" />
    )
  }

  // Not logged in -> Show Sign In link
  if (!profile) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50"
      >
        <User className="w-4 h-4 text-gold" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    )
  }

  // Initials for avatar placeholder
  const initials = [profile.first_name?.[0], profile.last_name?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || profile.email?.[0]?.toUpperCase() || 'U'

  const displayName = profile.first_name || profile.last_name
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : profile.email?.split('@')[0] || 'Member'

  const roleLabel = profile.role === 'admin' 
    ? 'Clinic Administrator' 
    : profile.role === 'client' 
    ? 'Auralixa Client' 
    : 'Standard Member'

  const dashboardHref = profile.role === 'admin' ? '/admin' : '/dashboard'

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button / Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full border border-border/80 hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all bg-card shadow-xs group"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-serif text-xs font-medium flex items-center justify-center tracking-wider">
            {initials}
          </div>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-foreground/50 group-hover:text-foreground transition-transform duration-200 hidden sm:block mr-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border/90 rounded-2xl shadow-lg py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border/60">
            <div className="flex items-center gap-3">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border border-gold/40 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-serif text-sm font-medium flex items-center justify-center shrink-0 border border-gold/40">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-xs text-foreground/60 truncate mt-0.5">
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="mt-2.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                profile.role === 'admin'
                  ? 'bg-purple-500/10 text-purple-700 border-purple-500/20'
                  : profile.role === 'client'
                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
              }`}>
                {profile.role === 'admin' ? (
                  <Shield className="w-3 h-3" />
                ) : (
                  <Sparkles className="w-3 h-3 text-gold" />
                )}
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <User className="w-4 h-4 text-gold" />
              <span>Profile</span>
            </Link>

            <Link
              href={dashboardHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gold" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Log Out */}
          <div className="pt-1 border-t border-border/60">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
