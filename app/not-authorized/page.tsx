import Link from 'next/link'
import { ShieldX, ArrowLeft, LogIn, LayoutDashboard } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SignOutButton } from '@/components/sign-out-button'

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-10 max-w-md w-full text-center shadow-sm">
        {/* Icon */}
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-5">
          <ShieldX className="w-8 h-8" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-medium mb-2">
          Not Authorized
        </h1>

        {/* Description */}
        <p className="text-sm text-foreground/70 leading-relaxed mb-6">
          You do not have permission to access the <strong>Clinic Administration Suite</strong>. This area is strictly reserved for authorized clinical staff.
        </p>

        {/* Status Callout */}
        <div className="bg-muted/50 border border-border/60 rounded-xl p-3 mb-6 text-xs text-foreground/70 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
          <span>Your account role is restricted to standard client access.</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants(),
              "w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Your Dashboard</span>
          </Link>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              "w-full border-border hover:bg-muted/50 text-foreground flex items-center justify-center gap-2"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Clinic Page</span>
          </Link>

          <div className="pt-2">
            <SignOutButton className="w-full justify-center" />
          </div>
        </div>

        {/* Help footer */}
        <div className="mt-8 pt-6 border-t border-border/60 text-xs text-foreground/50">
          Need clinical administrative access? Please speak with your clinic director.
        </div>
      </div>
    </div>
  )
}
