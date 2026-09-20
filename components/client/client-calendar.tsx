'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, CalendarDays, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClientCalendarProps {
  upcomingBookings: any[]
}

export function ClientCalendar({ upcomingBookings }: ClientCalendarProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Fix timezone issue by formatting selected date manually using local methods
  const formatLocalDate = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const selectedDateStr = formatLocalDate(selectedDate)
  const bookingsForSelectedDate = upcomingBookings.filter(
    (b) => b.appointment_date === selectedDateStr
  )

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end mb-2">
        <div className="inline-flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === 'list' ? "bg-background text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground"
            )}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === 'calendar' ? "bg-background text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground"
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Calendar
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        // List View
        <div className="space-y-3">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking: any) => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-xl gap-4">
                <div>
                  <h4 className="font-medium text-foreground text-sm">{booking.sessions?.title || booking.session_title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-foreground/60">
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <CalendarDays className="w-3.5 h-3.5 text-gold" />
                      {new Date(booking.appointment_date).toLocaleDateString('en-GB', { 
                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center space-y-3 bg-muted/10 rounded-xl border border-dashed border-border/80">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-foreground/40">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-foreground">No Upcoming Treatments</h3>
              <p className="text-xs text-foreground/60 max-w-sm mx-auto">
                You have no pending consultations scheduled. Use the button below to reserve your next session.
              </p>
            </div>
          )}
        </div>
      ) : (
        // Calendar View
        <div className="flex flex-col md:flex-row gap-6 bg-muted/10 p-4 sm:p-6 rounded-xl border border-border/50">
          {/* Calendar Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-foreground">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className="p-1.5 rounded-full hover:bg-muted text-foreground/70 border border-transparent hover:border-border transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={handleNextMonth} className="p-1.5 rounded-full hover:bg-muted text-foreground/70 border border-transparent hover:border-border transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-[10px] font-medium uppercase text-foreground/50">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dateStr = formatLocalDate(dateObj)
                
                const hasBooking = upcomingBookings.some(b => b.appointment_date === dateStr)
                const isSelected = selectedDateStr === dateStr
                const isToday = formatLocalDate(new Date()) === dateStr

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateObj)}
                    className={cn(
                      "relative p-2 h-10 w-full flex items-center justify-center rounded-lg text-sm transition-all",
                      isSelected ? "bg-primary text-primary-foreground font-semibold shadow-md" 
                      : isToday ? "bg-muted text-gold font-bold border border-gold/30"
                      : "bg-background border border-border/40 hover:border-gold/50 text-foreground"
                    )}
                  >
                    {day}
                    {hasBooking && !isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-gold"></span>
                    )}
                    {hasBooking && isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary-foreground"></span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-border/60 pt-6 md:pt-0 md:pl-6 flex flex-col">
            <h4 className="text-xs font-semibold uppercase text-foreground/50 mb-4" suppressHydrationWarning>
              {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}
            </h4>
            
            {bookingsForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {bookingsForSelectedDate.map(booking => (
                  <div key={booking.id} className="p-3 bg-background border border-border/80 rounded-xl shadow-sm">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {booking.sessions?.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-foreground/60 mb-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-foreground/60">
                      <MapPin className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{booking.sessions?.location || 'Clinic'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-foreground/40 py-8 bg-background border border-dashed border-border/80 rounded-xl">
                <Clock className="w-6 h-6 mb-2 opacity-30" />
                <p className="text-xs px-2">No appointments scheduled for this date.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
