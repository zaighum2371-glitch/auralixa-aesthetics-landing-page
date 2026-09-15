import { Suspense } from 'react'
import { ClientsManager } from '@/components/admin/clients-manager'
import { getClientsWithAggregates } from '@/actions/admin-clients'
import { MockClient } from '@/lib/admin-mock-data'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Clients & Medical Intake | Auralixa Aesthetics Admin',
  description: 'Manage clinic client directory, medical intake contraindications, and appointment history.',
}

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  const rawClients = await getClientsWithAggregates()

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

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-foreground/50">
          Loading client directory...
        </div>
      }
    >
      <ClientsManager initialClients={initialClients} currentUserId={currentUserId} />
    </Suspense>
  )
}
