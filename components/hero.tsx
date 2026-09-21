'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'

interface HeroProps {
  onBookingClick: () => void
  onExploreClick: () => void
}

export function Hero({ onBookingClick, onExploreClick }: HeroProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl font-serif font-bold text-foreground leading-tight">
                Reveal Your Best Self
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience luxury aesthetic treatments designed to enhance your natural beauty and boost your confidence.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground">Board-certified practitioners</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground">Premium products & techniques</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground">Personalized treatment plans</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onBookingClick}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base"
              >
                Schedule Consultation
              </Button>
              <Button 
                onClick={onExploreClick}
                variant="outline"
                className="px-8 py-6 text-base"
              >
                Explore Treatments
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/hero-image.png"
              alt="Auralixa Aesthetics Clinic"
              fill
              className="object-cover object-[center_30%]"
              priority
            />
          </div>
        </div>


      </div>
    </section>
  )
}
