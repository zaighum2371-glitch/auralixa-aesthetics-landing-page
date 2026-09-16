'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Clock, Sparkles, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClientBooking } from '@/actions/client-bookings'

type Step = 1 | 2 | 3

interface BookingWizardProps {
  sessions: any[] // MockSession type with category_name, etc.
}

export function BookingWizard({ sessions }: BookingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  
  // Selections
  const [selectedSessionId, setSelectedSessionId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('') // e.g. "10:00"
  const [clientNotes, setClientNotes] = useState<string>('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedSession = useMemo(() => 
    sessions.find(s => s.id === selectedSessionId),
    [sessions, selectedSessionId]
  )

  // Group sessions by category for Step 1
  const groupedSessions = useMemo(() => {
    const groups: Record<string, any[]> = {}
    sessions.forEach(s => {
      const cat = s.session_types?.name || 'General Aesthetics'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(s)
    })
    return groups
  }, [sessions])

  // Generate available dates (next 14 days)
  const availableDates = useMemo(() => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      dates.push(d)
    }
    return dates
  }, [])

  // Generate time slots for the selected date
  const availableSlots = useMemo(() => {
    if (!selectedSession || !selectedDate) return []
    
    const day = selectedDate.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = day === 0 || day === 6
    const startHour = 10 // 10 am
    const endHour = isWeekend ? 17 : 18 // 5 pm weekend, 6 pm weekday

    const totalMinutes = (selectedSession.duration_minutes || 60) + (selectedSession.buffer_minutes || 15)
    
    const slots = []
    let currentMinutes = startHour * 60 // 10:00 AM

    while (currentMinutes + totalMinutes <= endHour * 60) {
      const h = Math.floor(currentMinutes / 60)
      const m = currentMinutes % 60
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
      currentMinutes += totalMinutes
    }
    
    return slots
  }, [selectedDate, selectedSession])

  const handleNext = () => {
    if (currentStep === 1 && selectedSessionId) setCurrentStep(2)
    if (currentStep === 2 && selectedDate && selectedTime) setCurrentStep(3)
  }

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1)
    if (currentStep === 3) setCurrentStep(2)
  }

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [h, m] = startTime.split(':').map(Number)
    const totalMins = h * 60 + m + durationMinutes
    const endH = Math.floor(totalMins / 60)
    const endM = totalMins % 60
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`
  }

  const handleConfirm = async () => {
    if (!selectedSession || !selectedDate || !selectedTime) return
    setIsSubmitting(true)
    
    // Format date as YYYY-MM-DD
    const yyyy = selectedDate.getFullYear()
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const dd = String(selectedDate.getDate()).padStart(2, '0')
    const appointment_date = `${yyyy}-${mm}-${dd}`
    
    const end_time = calculateEndTime(selectedTime, selectedSession.duration_minutes)

    const res = await createClientBooking({
      session_id: selectedSession.id,
      appointment_date,
      start_time: selectedTime,
      end_time,
      client_notes: clientNotes,
      total_price: selectedSession.pricing,
      slot_count: 1
    })

    setIsSubmitting(false)
    if (res.success) {
      router.push(`/book/success?ref=${res.booking?.booking_reference}`)
    } else {
      alert(res.error || 'Failed to book session. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      {/* Steps Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border/40 z-0"></div>
        {[
          { num: 1, label: 'Treatment' },
          { num: 2, label: 'Date & Time' },
          { num: 3, label: 'Confirm' }
        ].map((step) => (
          <div key={step.num} className="relative z-10 flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-medium transition-colors border",
              currentStep === step.num ? "bg-gold text-background border-gold" : 
              currentStep > step.num ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground/40 border-border"
            )}>
              {currentStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
            </div>
            <span className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              currentStep >= step.num ? "text-foreground" : "text-foreground/40"
            )}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-10 flex-1">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h1 className="font-serif text-3xl text-foreground mb-3">Select Your Treatment</h1>
              <p className="text-foreground/60 text-sm">Choose from our curated selection of medical aesthetic procedures. Each treatment is tailored to your unique clinical profile.</p>
            </div>
            
            <div className="space-y-8">
              {Object.entries(groupedSessions).map(([category, catSessions]) => (
                <div key={category}>
                  <h3 className="font-serif text-xl text-gold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {catSessions.map(session => (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                        className={cn(
                          "text-left p-5 rounded-2xl border transition-all hover:border-gold/50 flex flex-col h-full",
                          selectedSessionId === session.id 
                            ? "border-gold bg-gold/5 shadow-md shadow-gold/10" 
                            : "border-border/60 bg-muted/10 hover:bg-muted/30"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground text-lg">{session.title}</h4>
                          <span className="font-serif font-medium text-gold">£{session.pricing}</span>
                        </div>
                        <p className="text-xs text-foreground/60 line-clamp-2 mb-4 flex-1">
                          {session.description || 'Premium clinical aesthetic treatment.'}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] font-medium text-foreground/50">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {session.duration_minutes} mins
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-10 flex-1 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="font-serif text-2xl text-foreground mb-6">Choose a Date</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableDates.map((date, i) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString()
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedDate(date)
                        setSelectedTime('') // reset time when date changes
                      }}
                      className={cn(
                        "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all",
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary shadow-md" 
                          : "bg-background border-border/80 text-foreground hover:border-gold hover:bg-gold/5"
                      )}
                    >
                      <span className="text-xs font-medium uppercase opacity-70">
                        {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                      </span>
                      <span className="font-serif text-xl font-bold">
                        {date.getDate()}
                      </span>
                      <span className="text-[10px] uppercase opacity-70">
                        {date.toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-border/60 pt-6 md:pt-0 md:pl-8">
              <h2 className="font-serif text-2xl text-foreground mb-6">Select Time</h2>
              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-foreground/40 border border-dashed border-border/80 rounded-xl">
                  <Calendar className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Please select a date<br/>to view availability</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-amber-600/80 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5 p-4">
                  <p className="text-sm">No slots available on this date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {availableSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-3 rounded-lg border text-sm font-medium transition-all",
                        selectedTime === time
                          ? "bg-gold text-background border-gold shadow-md"
                          : "bg-muted/10 border-border/60 text-foreground hover:border-gold/50 hover:bg-gold/5"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && selectedSession && selectedDate && selectedTime && (
          <div className="p-6 sm:p-10 flex-1 max-w-3xl mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl text-foreground mb-3">Review & Confirm</h2>
              <p className="text-foreground/60 text-sm">Please review your consultation details below.</p>
            </div>
            
            <div className="bg-muted/20 border border-border/60 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-start border-b border-border/50 pb-6">
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground">{selectedSession.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-foreground/60">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold" /> {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-foreground/60">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold" /> {selectedTime} ({selectedSession.duration_minutes} mins)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-xs uppercase font-semibold text-foreground/50 mb-1">Total</span>
                  <span className="font-serif text-2xl font-bold text-gold">£{selectedSession.pricing}</span>
                  <span className="block text-[10px] text-foreground/40 mt-1">Pay at clinic</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2">Clinical Notes & Requests (Optional)</label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Any specific concerns, allergies, or questions for your practitioner..."
                  className="w-full p-4 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:ring-2 focus:ring-gold/40 focus:outline-none min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="p-6 border-t border-border/60 bg-muted/10 flex items-center justify-between mt-auto">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full border border-border bg-background text-foreground text-sm font-semibold flex items-center gap-2 hover:bg-muted transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div /> // Spacer
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !selectedSessionId) ||
                (currentStep === 2 && (!selectedDate || !selectedTime))
              }
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-gold text-background text-sm font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Booking'} <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
