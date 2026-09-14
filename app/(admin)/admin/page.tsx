import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { extractStoragePath } from '@/lib/supabase/avatar'
import { AdminOverview } from '@/components/admin/admin-overview'
import { getSessionCategories, getSessions } from '@/actions/admin-sessions'
import { getBookings } from '@/actions/admin-bookings'
import { getClientsWithAggregates } from '@/actions/admin-clients'
import { MockCategory, MockSession, MockClient, MockBooking } from '@/lib/admin-mock-data'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Concurrently fetch profiles, categories, treatments, bookings, and clients
  const [
    { data: profiles },
    rawCategories,
    rawSessions,
    rawBookings,
    rawClients,
  ] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    getSessionCategories(),
    getSessions(),
    getBookings(),
    getClientsWithAggregates(),
  ])

  const userList = profiles || []

  // Batch resolve signed URLs for users with avatars stored in private bucket
  const avatarPaths = userList
    .map((p) => extractStoragePath(p.avatar_url))
    .filter((p): p is string => Boolean(p))

  const signedUrlMap: Record<string, string> = {}
  if (avatarPaths.length > 0) {
    try {
      const { data: signedData } = await supabase.storage
        .from('avatars')
        .createSignedUrls(avatarPaths, 60 * 60 * 24)

      if (signedData) {
        signedData.forEach((item) => {
          if (item.signedUrl && item.path) {
            signedUrlMap[item.path] = item.signedUrl
          }
        })
      }
    } catch (err) {
      console.error('Failed to create signed URLs for admin view:', err)
    }
  }

  // Map real database entities to Mock data structures for the Overview dashboard
  const categories: MockCategory[] = (rawCategories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    default_duration_minutes: c.default_duration_minutes || 60,
    buffer_minutes: c.buffer_minutes || 15,
    is_active: c.is_active !== false,
  }))

  const sessions: MockSession[] = (rawSessions || []).map((s: any) => ({
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
    location: s.location || 'Harley Street Clinic',
    status: s.status || 'active',
    is_ongoing: Boolean(s.is_ongoing),
    image_url: s.image_url || undefined,
  }))

  const clients: MockClient[] = (rawClients || []).map((c: any) => ({
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

  const bookings: MockBooking[] = (rawBookings || []).map((b: any) => ({
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

  // Server Action to update user role for testing
  async function updateUserRole(userId: string, newRole: 'user' | 'client' | 'admin') {
    'use server'
    const adminSupabase = await createClient()
    await adminSupabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    revalidatePath('/admin')
    revalidatePath('/dashboard')
  }

  return (
    <AdminOverview
      userList={userList}
      signedUrlMap={signedUrlMap}
      updateUserRole={updateUserRole}
      liveData={{
        categories,
        sessions,
        clients,
        bookings,
      }}
    />
  )
}
