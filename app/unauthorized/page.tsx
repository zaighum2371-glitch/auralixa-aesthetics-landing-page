import Link from 'next/link'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-14 h-14 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-medium mb-2">
          Access Restricted
        </h1>

        <p className="text-sm text-foreground/70 leading-relaxed mb-6">
          You do not have the required administrative permissions to access this clinical area, or your account privileges are restricted.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants(),
              "w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Client Portal</span>
          </Link>

          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              "w-full border-border hover:bg-muted/50 text-foreground flex items-center justify-center gap-2"
            )}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with an Admin Account</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border/60 text-xs text-foreground/50">
          Need clinical administrative access? Contact the clinic system manager.
        </div>
      </div>
    </div>
  )
}
