import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/sign-out-button'
import { Sparkles, Calendar, ShieldCheck, User, ArrowRight, Clock, MapPin, AlertCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function ClientDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user.email?.split('@')[0] || 'Client'

  const role = profile?.role || 'user'
  const status = profile?.status || 'active'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="border-b border-border/70 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="font-serif text-lg tracking-widest uppercase font-medium">Auralixa</span>
          </Link>

          <div className="flex items-center gap-4">
            {role === 'admin' && (
              <Link 
                href="/admin" 
                className={cn(buttonVariants({ size: 'sm' }), "bg-gold text-white hover:bg-gold/90 font-medium")}
              >
                Go to Admin Suite
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-gold font-semibold">Client Portal</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                role === 'admin' 
                  ? 'bg-purple-500/10 text-purple-700 border-purple-500/20' 
                  : role === 'client'
                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
              }`}>
                <ShieldCheck className="w-3 h-3" />
                Role: {role.toUpperCase()}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                Status: {status}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-foreground/70 max-w-xl">
              Manage your aesthetic consultations, upcoming appointments, and confidential clinical preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/#treatments" 
              className={cn(buttonVariants(), "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center gap-2")}
            >
              <span>Explore Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Role Explanation Note for 'user' */}
        {role === 'user' && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-amber-900">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Initial Member Profile</p>
              <p className="text-xs text-amber-800/80 mt-0.5">
                You are currently registered as a Standard Member. Once you schedule your first consultation, your account role will automatically be promoted to <strong>Client</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Appointment Mock */}
          <div className="md:col-span-2 bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-lg font-medium text-foreground">Upcoming Care & Appointments</h2>
              </div>
              <span className="text-xs text-foreground/50">0 Scheduled</span>
            </div>

            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-foreground/40">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-foreground">No Upcoming Treatments</h3>
              <p className="text-xs text-foreground/60 max-w-sm mx-auto">
                You have no pending consultations scheduled. Browse our medical aesthetic catalog to reserve your next session.
              </p>
              <div className="pt-2">
                <Link 
                  href="/#treatments" 
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "border-border hover:bg-muted text-foreground")}
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Quick Card */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-4">
              <User className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-lg font-medium text-foreground">Profile Overview</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-foreground/50 block">Registered Email</span>
                <span className="font-medium text-foreground">{user.email}</span>
              </div>

              <div>
                <span className="text-xs text-foreground/50 block">Full Name</span>
                <span className="font-medium text-foreground">
                  {profile?.first_name || profile?.last_name 
                    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
                    : 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-xs text-foreground/50 block">Phone Number</span>
                <span className="font-medium text-foreground">{profile?.phone || 'Not provided'}</span>
              </div>

              <div>
                <span className="text-xs text-foreground/50 block">Clinic Location</span>
                <span className="font-medium text-foreground flex items-start gap-1.5 mt-1 text-xs leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                  <span>Castlemere Community Centre, 60 Tweedale St, OL11 1HH, Rochdale, Greater Manchester, United Kingdom</span>
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <Link
                href="/profile"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  "w-full border-border hover:bg-muted text-foreground flex items-center justify-center gap-2"
                )}
              >
                <User className="w-3.5 h-3.5 text-gold" />
                <span>Manage Profile Details</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
