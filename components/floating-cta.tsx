'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export function FloatingCTA({ onBookingClick }: { onBookingClick: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show when scrolled past hero (approx 600px)
      if (window.scrollY > 600) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <Button 
        onClick={onBookingClick}
        className="bg-accent text-zinc-900 hover:bg-accent/90 shadow-[0_10px_40px_-10px_rgba(212,175,55,0.5)] rounded-full px-8 py-7 font-bold text-lg flex items-center gap-3 group"
      >
        <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Book Now
      </Button>
    </div>
  )
}
