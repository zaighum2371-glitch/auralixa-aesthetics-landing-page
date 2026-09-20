import { Suspense } from 'react'
import { ClientsManager } from '@/components/admin/clients-manager'
import { getClientsWithAggregates } from '@/actions/admin-clients'
import { getBookings } from '@/actions/admin-bookings'
import { MockClient } from '@/lib/admin-mock-data'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Clients & Medical Intake | Auralixa Aesthetics Admin',
  description: 'Manage clinic client directory, medical intake contraindications, and appointment history.',
}

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  const [
    rawClients,
    rawBookings
  ] = await Promise.all([
    getClientsWithAggregates(),
    getBookings()
  ])

  const initialClients: MockClient[] = (rawClients || []).map((c: any) => ({
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

  const initialBookings: any[] = (rawBookings || []).map((b: any) => ({
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

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-foreground/50">
          Loading client directory...
        </div>
      }
    >
      <ClientsManager initialClients={initialClients} initialBookings={initialBookings} currentUserId={currentUserId} />
    </Suspense>
  )
}
