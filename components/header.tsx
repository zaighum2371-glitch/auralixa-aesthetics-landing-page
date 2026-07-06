'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface HeaderProps {
  onBookingClick: () => void
}

export function Header({ onBookingClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 10)
    }, { passive: true })
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
        New Skin Revitalization Package • Limited Time Offer
      </div>

      {/* Sticky Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-foreground">Auralixa</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#treatments" className="text-sm text-foreground hover:text-accent transition-colors">
              Treatments
            </a>
            <a href="#gallery" className="text-sm text-foreground hover:text-accent transition-colors">
              Gallery
            </a>
            <a href="#testimonials" className="text-sm text-foreground hover:text-accent transition-colors">
              Testimonials
            </a>
            <a href="#faq" className="text-sm text-foreground hover:text-accent transition-colors">
              FAQ
            </a>
          </nav>

          {/* CTA Button */}
          <Button 
            onClick={onBookingClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Book Consultation
          </Button>
        </div>
      </header>
    </>
  )
}
