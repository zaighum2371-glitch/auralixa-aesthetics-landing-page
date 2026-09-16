'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { submitBooking } from '@/actions/submit-booking'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTreatment?: string
  sessions?: any[]
}

export function BookingModal({ isOpen, onClose, selectedTreatment, sessions = [] }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    treatment: selectedTreatment || '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    concerns: '',
  })

  // Sync selected treatment into form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        treatment: selectedTreatment || ''
      }))
    }
  }, [isOpen, selectedTreatment])

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await submitBooking(formData)
      alert(`Thank you! Your consultation request has been submitted. Booking Reference: ${res.booking_reference}`)
      setStep(1)
      setFormData({
        treatment: selectedTreatment || '',
        date: '',
        time: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        concerns: '',
      })
      onClose()
    } catch (err: any) {
      alert(err.message || 'An error occurred while booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      treatment: selectedTreatment || '',
      date: '',
      time: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      concerns: '',
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Book Your Consultation</DialogTitle>
          <DialogDescription>Step {step} of 3</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: Treatment Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">Select Treatment</span>
                <select
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Choose a treatment...</option>
                  {sessions.map((treatment) => (
                    <option key={treatment.id} value={treatment.title}>
                      {treatment.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">Preferred Date</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">Preferred Time</span>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Select a time...</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </label>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">First Name <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">Last Name <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">Email <span className="text-red-500">*</span></span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="07xxx xxxxxx"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </label>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">Skin Concerns & Goals</span>
                <textarea
                  name="concerns"
                  value={formData.concerns}
                  onChange={handleInputChange}
                  placeholder="Tell us about your skin concerns and what you'd like to achieve..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground min-h-24"
                />
              </label>

              {/* Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm"><strong>Treatment:</strong> {formData.treatment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm"><strong>Date & Time:</strong> {formData.date} at {formData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm"><strong>Contact:</strong> {formData.firstName} {formData.lastName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button onClick={handleBack} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          
          {step < 3 && (
            <Button 
              onClick={handleNext} 
              disabled={step === 1 ? !(formData.treatment && formData.date && formData.time) : !(formData.firstName && formData.lastName && /^[^@]+@[^@]+\.[^@]+$/.test(formData.email))}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {step === 3 && (
            <Button
              onClick={handleSubmit}
              disabled={!formData.concerns || isSubmitting}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Complete Booking
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
