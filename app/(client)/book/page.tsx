import { getClientAvailableSessions } from '@/actions/client-bookings'
import { BookingWizard } from '@/components/client/booking-wizard'
import { SignOutButton } from '@/components/sign-out-button'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function BookPage() {
  const sessions = await getClientAvailableSessions()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "text-foreground/60 hover:text-foreground shrink-0")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="w-5 h-5" />
              <span className="font-serif text-lg tracking-wide font-medium">Auralixa Bookings</span>
            </div>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/5 via-background to-background">
        <BookingWizard sessions={sessions} />
      </main>
    </div>
  )
}
