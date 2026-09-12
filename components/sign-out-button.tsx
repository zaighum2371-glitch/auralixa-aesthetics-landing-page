'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      className={`border-border hover:bg-destructive/10 hover:text-destructive transition-colors gap-2 ${className || ''}`}
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </Button>
  )
}
