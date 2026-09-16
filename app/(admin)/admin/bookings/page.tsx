import { Suspense } from 'react'
import { BookingsManager } from '@/components/admin/bookings-manager'
import { getBookings } from '@/actions/admin-bookings'
import { getClientsWithAggregates } from '@/actions/admin-clients'
import { getSessions } from '@/actions/admin-sessions'
import { MockBooking, MockClient, MockSession } from '@/lib/admin-mock-data'

export const metadata = {
  title: 'Bookings & Agenda | Auralixa Aesthetics Admin',
  description: 'Oversee clinic bookings, appointment status transitions, and front-desk in-person settlements.',
}

export default async function BookingsPage() {
  const [rawBookings, rawClients, rawSessions] = await Promise.all([
    getBookings(),
    getClientsWithAggregates(),
    getSessions(),
  ])

  const initialBookings: MockBooking[] = (rawBookings || []).map((b: any) => ({
    id: b.id,
    booking_reference: b.booking_reference,
    client_id: b.client_id,
    client_name: b.client
      ? `${b.client.first_name || ''} ${b.client.last_name || ''}`.trim() || b.client.email
      : 'Unknown Client',
    client_email: b.client?.email || '',
    client_phone: b.client?.phone || '',
    session_id: b.session_id,
    session_title: b.session?.title || 'Unknown Session',
    category_name: b.session?.session_types?.name || 'General Aesthetics',
    appointment_date: b.appointment_date,
    start_time: b.start_time,
    end_time: b.end_time,
    total_price: Number(b.total_price) || 0,
    status: b.status,
    payment_status: b.payment_status,
    payment_method_note: b.payment_method_note || null,
    client_notes: b.client_notes || null,
    admin_notes: b.admin_notes || null,
    cancel_reason: b.cancel_reason || null,
  }))

  const liveClients: MockClient[] = (rawClients || []).map((c: any) => ({
    id: c.id,
    first_name: c.first_name || 'Client',
    last_name: c.last_name || '',
    email: c.email || '',
    phone: c.phone || '',
    avatar_url: c.avatar_url || null,
    date_of_birth: c.date_of_birth || '1990-01-01',
    address_line1: c.address_line1 || '',
    address_line2: c.address_line2 || undefined,
    city: c.city || 'London',
    state: c.state || undefined,
    postal_code: c.postal_code || '',
    country: c.country || 'United Kingdom',
    emergency_contact_name: c.emergency_contact_name || '',
    emergency_contact_phone: c.emergency_contact_phone || '',
    medical_allergies: c.medical_allergies || 'None recorded',
    role: c.role || 'client',
    status: c.status || 'active',
    total_bookings: c.total_bookings || 0,
    total_spend: c.total_spend || 0,
    last_visit: c.last_visit || 'Never',
    created_at: c.created_at || new Date().toISOString(),
  }))

  const liveSessions: MockSession[] = (rawSessions || []).map((s: any) => ({
    id: s.id,
    session_type_id: s.session_type_id,
    category_name: s.session_types?.name || 'Treatment',
    title: s.title,
    slug: s.slug || '',
    description: s.description || '',
    benefits: s.benefits || [],
    pricing: Number(s.pricing) || 0,
    currency: s.currency || 'GBP',
    duration_minutes: s.duration_minutes || 60,
    buffer_minutes: s.session_types?.buffer_minutes || 15,
    max_slots: s.max_slots || 1,
    location: s.location || 'Castlemere Community Centre, Rochdale',
    status: s.status || 'active',
    is_ongoing: Boolean(s.is_ongoing),
    image_url: s.image_url || undefined,
  }))

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-foreground/50">
          Loading clinic bookings...
        </div>
      }
    >
      <BookingsManager
        initialBookings={initialBookings}
        liveClients={liveClients}
        liveSessions={liveSessions}
      />
    </Suspense>
  )
}
