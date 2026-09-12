import Link from 'next/link'
import { Sparkles, LayoutDashboard, Calendar, Users, FileText, Settings, ShieldCheck, ArrowLeft } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border/80 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <Link href="/" className="flex items-center gap-2 group">
              <Sparkles className="w-5 h-5 text-gold" />
              <div>
                <span className="font-serif text-lg tracking-widest uppercase font-medium block">
                  Auralixa
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gold font-semibold block">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </Link>

            <div className="pt-2">
              <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-foreground/40 block mb-1">
                Clinical Operations (Phased)
              </span>
              <div className="space-y-1 text-sm text-foreground/70">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg opacity-60 cursor-not-allowed">
                  <span className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    <span>Clinic Calendar</span>
                  </span>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground/50">Phase 7</span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-lg opacity-60 cursor-not-allowed">
                  <span className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    <span>Treatments Catalog</span>
                  </span>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground/50">Phase 6</span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-lg opacity-60 cursor-not-allowed">
                  <span className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>Clients & Intake</span>
                  </span>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground/50">Phase 8</span>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="pt-6 border-t border-border/60 space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Client View</span>
          </Link>
          <div className="flex items-center justify-between pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Verified
            </span>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/70 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground/70">
            Auralixa Aesthetic Suite &bull; Central Administration
          </h2>
          <div className="text-xs text-foreground/50">
            Database: PostgreSQL 17 (Active Healthy)
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
