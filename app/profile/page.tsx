import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { type ProfileRow } from '@/types/database'
import { ProfileForm } from '@/components/profile-form'
import { SignOutButton } from '@/components/sign-out-button'
import { Sparkles, ArrowLeft, LayoutDashboard, Shield } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/profile')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const dashboardHref = profile.role === 'admin' ? '/admin' : '/dashboard'
  const dashboardLabel = profile.role === 'admin' ? 'Admin Suite' : 'Dashboard'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header Navigation */}
      <header className="border-b border-border/70 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-gold" />
              <span className="hidden sm:inline">Back to {dashboardLabel}</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <span className="text-foreground/30 hidden sm:inline">&bull;</span>

            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-serif text-base tracking-widest uppercase font-medium">
                Auralixa
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={dashboardHref}
              className="text-xs font-medium text-foreground/80 hover:text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 hover:bg-muted/50 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-gold" />
              <span>{dashboardLabel}</span>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">
            Account Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mt-1">
            Your Profile
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            Manage your personal profile details, contact numbers, and clinical aesthetic preferences.
          </p>
        </div>

        {/* Profile Form */}
        <ProfileForm initialProfile={profile as ProfileRow} />
      </main>
    </div>
  )
}
