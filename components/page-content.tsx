'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { TreatmentsSection } from '@/components/treatments-section'
import { BookingModal } from '@/components/booking-modal'
import { SocialProof } from '@/components/social-proof'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'

export function PageContent() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedTreatment, setSelectedTreatment] = useState<string | undefined>()

  const handleBookingClick = () => {
    setSelectedTreatment(undefined)
    setIsBookingOpen(true)
  }

  const handleTreatmentSelect = (treatmentName: string) => {
    setSelectedTreatment(treatmentName)
    setIsBookingOpen(true)
  }

  const handleExploreClick = () => {
    const element = document.getElementById('treatments')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header onBookingClick={handleBookingClick} />
      <Hero onBookingClick={handleBookingClick} onExploreClick={handleExploreClick} />
      <TreatmentsSection onTreatmentSelect={handleTreatmentSelect} />
      <SocialProof />
      <FAQ />
      <Footer onBookingClick={handleBookingClick} />
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        selectedTreatment={selectedTreatment}
      />
    </>
  )
}
