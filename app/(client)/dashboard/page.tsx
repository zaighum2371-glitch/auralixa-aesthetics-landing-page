import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/sign-out-button'
import { Sparkles, Calendar, ShieldCheck, User, ArrowRight, Clock, MapPin, AlertCircle, History, Bell, FileText, Award } from 'lucide-react'
import { ClientCalendar } from '@/components/client/client-calendar'
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

  const { data: pastBookings } = await supabase
    .from('bookings')
    .select('*, sessions(title, post_care_instructions)')
    .eq('client_id', user.id)
    .eq('status', 'completed')
    .order('appointment_date', { ascending: false })

  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select('*, sessions(title, location)')
    .eq('client_id', user.id)
    .in('status', ['pending', 'confirmed'])
    .order('appointment_date', { ascending: true })
    .limit(5)

  const recentBookingWithCare = pastBookings?.find((b: any) => b.sessions?.post_care_instructions)

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
              href="/book" 
              className={cn(buttonVariants(), "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center gap-2")}
            >
              <span>Book Now</span>
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
          {/* Upcoming Appointment Calendar */}
          <div className="md:col-span-2 bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-lg font-medium text-foreground">My Upcoming Bookings</h2>
              </div>
              <span className="text-xs text-foreground/50">{upcomingBookings?.length || 0} Scheduled</span>
            </div>

            <ClientCalendar upcomingBookings={upcomingBookings || []} />
            
            <div className="pt-2 border-t border-border/60 flex justify-end">
              <Link 
                href="/book" 
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "border-gold/30 text-gold hover:bg-gold/10")}
              >
                Schedule New Consultation
              </Link>
            </div>
          </div>

          {/* Past Treatment History */}
          <div className="md:col-span-2 bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-lg font-medium text-foreground">Past Treatment History</h2>
              </div>
            </div>

            {pastBookings && pastBookings.length > 0 ? (
              <div className="space-y-3">
                {pastBookings.map((booking: any) => (
                  <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-xl gap-4">
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{booking.sessions?.title || booking.session_title}</h4>
                      <p className="text-xs text-foreground/60 mt-1">
                        {new Date(booking.appointment_date).toLocaleDateString('en-GB', { 
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                        })} at {booking.start_time.slice(0, 5)}
                      </p>
                    </div>
                    <Link 
                      href="/book"
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "border-gold/30 text-gold hover:bg-gold/10 whitespace-nowrap")}
                    >
                      Book Again
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-foreground/40">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-medium text-foreground">No Past Treatments Found</h3>
                <p className="text-xs text-foreground/60 max-w-sm mx-auto">
                  Once you complete a treatment with Auralixa Aesthetics, your clinical summary and invoice will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notifications & Alerts */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                <Bell className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-lg font-medium text-foreground">Notifications & Alerts</h2>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted/40 rounded-xl border border-border/50 text-sm">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    Welcome to the Portal
                  </p>
                  <p className="text-foreground/70 text-xs mt-1 leading-relaxed">
                    Please ensure your medical intake forms are completed before your first consultation.
                  </p>
                </div>
                {recentBookingWithCare ? (
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-sm">
                    <p className="font-semibold text-emerald-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      Post-Care: {recentBookingWithCare.sessions?.title}
                    </p>
                    <p className="text-emerald-900/80 text-xs mt-1 leading-relaxed">
                      {recentBookingWithCare.sessions?.post_care_instructions}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-sm">
                    <p className="font-semibold text-emerald-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      Post-Care Reminder
                    </p>
                    <p className="text-emerald-900/80 text-xs mt-1 leading-relaxed">
                      No active post-care instructions. When you complete a treatment, personalized aftercare advice from your practitioner will appear here.
                    </p>
                  </div>
                )}
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
        {/* End of Main Grid */}
        </div>

        {/* Loyalty & Intakes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Medical / Intake Forms */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Medical Intake Forms</h3>
                <p className="text-xs text-foreground/60 mt-0.5">Update your medical history and allergies securely.</p>
              </div>
            </div>
            <Link href="/profile" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "border-border hover:bg-muted shrink-0")}>
              Review
            </Link>
          </div>

          {/* Loyalty & Rewards */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Auralixa Rewards</h3>
                <p className="text-xs text-foreground/60 mt-0.5">Refer a friend and unlock exclusive VIP pricing.</p>
              </div>
            </div>
            <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "border-border hover:bg-muted shrink-0")} disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
