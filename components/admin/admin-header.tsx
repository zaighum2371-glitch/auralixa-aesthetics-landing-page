'use client'

import React from 'react'
import { UserProfileMenu } from '@/components/user-profile-menu'
import { Sparkles } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-border/70 bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex items-center gap-2 text-xs text-foreground/60">
          <span className="font-serif font-medium text-foreground tracking-wide">
            Auralixa Aesthetic Suite
          </span>
          <span>&bull;</span>
          <span className="text-foreground/50">Harley Street Clinic</span>
        </div>
        <div className="sm:hidden text-xs font-serif font-medium text-foreground">
          Admin Console
        </div>
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
          <Sparkles className="w-3 h-3" />
          Preview Mockup Mode
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User profile dropdown menu with avatar and user name */}
        <UserProfileMenu showName={true} />
      </div>
    </header>
  )
}
