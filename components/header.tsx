'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserProfileMenu } from '@/components/user-profile-menu'

interface HeaderProps {
  onBookingClick: () => void
}

export function Header({ onBookingClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

          {/* CTA Button, User Profile Menu, and Social */}
          <div className="flex items-center gap-3 sm:gap-4">
            <UserProfileMenu />
            <Button 
              onClick={onBookingClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Book Consultation
            </Button>
            <a 
              href="https://www.instagram.com/auralixa_aesthetics/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
