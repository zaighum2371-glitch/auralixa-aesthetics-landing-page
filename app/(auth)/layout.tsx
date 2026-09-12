import Link from 'next/link'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-gold" />
          <span>Back to Clinic</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="font-serif text-lg tracking-widest text-foreground font-medium uppercase">
            Auralixa
          </span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        {children}
      </div>

      {/* Bottom Footer Note */}
      <div className="text-center text-xs text-foreground/50 py-4">
        <p>&copy; {new Date().getFullYear()} Auralixa Aesthetics. All rights reserved.</p>
        <p className="mt-1">Private, confidential & medical-grade care.</p>
      </div>
    </div>
  )
}
