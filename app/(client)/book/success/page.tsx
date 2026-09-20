import Link from 'next/link'
import { CheckCircle2, CalendarHeart, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function BookSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string }
}) {
  const bookingRef = searchParams.ref || 'PENDING'

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border/80 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h1 className="font-serif text-3xl text-foreground mb-3">Booking Confirmed</h1>
          <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
            Your consultation has been successfully scheduled. A confirmation email has been sent to your registered address.
          </p>

          <div className="bg-muted/20 border border-border/60 rounded-xl p-4 w-full mb-8">
            <span className="text-[10px] uppercase font-semibold text-foreground/50 tracking-wider">Booking Reference</span>
            <div className="font-mono text-xl font-bold text-foreground mt-1 tracking-widest">
              {bookingRef}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link 
              href="/dashboard"
              className={cn(buttonVariants({ size: 'lg' }), "w-full rounded-full bg-gold text-background hover:bg-gold/90 hover:opacity-100 font-bold shadow-md")}
            >
              Return to Dashboard
            </Link>
            <p className="text-xs text-foreground/40 mt-3 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" />
              Thank you for choosing Auralixa Aesthetics.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
