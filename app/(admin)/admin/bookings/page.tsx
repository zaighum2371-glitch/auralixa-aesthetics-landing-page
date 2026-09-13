import { Suspense } from 'react'
import { BookingsManager } from '@/components/admin/bookings-manager'

export const metadata = {
  title: 'Bookings & Agenda | Auralixa Aesthetics Admin',
  description: 'Oversee clinic bookings, appointment status transitions, and front-desk in-person settlements.',
}

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-foreground/50">
          Loading clinic bookings...
        </div>
      }
    >
      <BookingsManager />
    </Suspense>
  )
}
