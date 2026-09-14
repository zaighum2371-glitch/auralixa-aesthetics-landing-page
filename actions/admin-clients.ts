'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getClientsWithAggregates(filters?: {
  status?: string
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select(`
      *,
      bookings(
        id,
        appointment_date,
        total_price,
        status,
        payment_status,
        booking_reference,
        session:sessions(title)
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status as any)
  }

  const { data: profiles, error } = await query
  if (error || !profiles) {
    console.error('Error fetching clients:', error)
    return []
  }

  // Aggregate stats per client
  const clientsWithStats = profiles.map((p) => {
    const bookingsList: any[] = p.bookings || []
    const totalSpend = bookingsList
      .filter((b: any) => b.payment_status === 'paid_in_person')
      .reduce((sum: number, b: any) => sum + (b.total_price || 0), 0)

    const sortedDates = bookingsList
      .map((b: any) => b.appointment_date)
      .filter(Boolean)
      .sort()
      .reverse()

    const lastVisit = sortedDates[0] || 'Never'

    return {
      ...p,
      total_bookings: bookingsList.length,
      total_spend: totalSpend,
      last_visit: lastVisit,
      appointment_ledger: bookingsList,
    }
  })

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    return clientsWithStats.filter((c) =>
      `${c.first_name || ''} ${c.last_name || ''} ${c.email || ''} ${c.phone || ''} ${c.medical_allergies || ''} ${c.city || ''}`
        .toLowerCase()
        .includes(q)
    )
  }

  return clientsWithStats
}

export async function updateClientProfile(
  id: string,
  updates: {
    first_name?: string
    last_name?: string
    phone?: string
    date_of_birth?: string
    address_line1?: string
    address_line2?: string
    city?: string
    postal_code?: string
    country?: string
    emergency_contact_name?: string
    emergency_contact_phone?: string
    medical_allergies?: string
    status?: 'active' | 'suspended' | 'banned'
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating client profile:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/clients')
  revalidatePath('/profile')
  return { success: true, data }
}

export async function updateClientStatus(
  id: string,
  newStatus: 'active' | 'suspended' | 'banned',
  reason?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: current } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', id)
    .single()

  const isRestricted = newStatus === 'suspended' || newStatus === 'banned'

  const { data, error } = await supabase
    .from('profiles')
    .update({
      status: newStatus,
      ban_reason: isRestricted ? reason || 'Status updated by clinic administration' : null,
      banned_at: isRestricted ? new Date().toISOString() : null,
      banned_by: isRestricted && user ? user.id : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Audit trail in user_status_history
  if (user && current) {
    await supabase.from('user_status_history').insert({
      user_id: id,
      changed_by: user.id,
      old_status: current.status,
      new_status: newStatus,
      reason: reason || `Account moderated to ${newStatus}`,
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/clients')
  return { success: true, data }
}

export async function getClientDossier(clientId: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      bookings(
        id,
        booking_reference,
        appointment_date,
        start_time,
        end_time,
        total_price,
        status,
        payment_status,
        payment_method_note,
        client_notes,
        admin_notes,
        session:sessions(id, title, pricing, session_types(name))
      )
    `)
    .eq('id', clientId)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}

export async function createClientRecord(formData: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  address_line1?: string
  address_line2?: string
  city?: string
  postal_code?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_allergies?: string
  role?: 'client' | 'user'
  status?: 'active' | 'suspended' | 'banned'
}) {
  try {
    const adminSupabase = createAdminClient()
    const tempPassword = `Aurx!${Math.random().toString(36).slice(2, 10)}${Math.floor(100 + Math.random() * 900)}`

    // Provision auth user
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: formData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: formData.first_name,
        last_name: formData.last_name,
      },
    })

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Failed to provision auth user' }
    }

    const userId = authData.user.id

    // Give database trigger a tiny moment to create profile row if needed, then update
    await new Promise((res) => setTimeout(res, 250))

    const { data: updatedProfile, error: profileError } = await adminSupabase
      .from('profiles')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || null,
        date_of_birth: formData.date_of_birth || null,
        address_line1: formData.address_line1 || null,
        address_line2: formData.address_line2 || null,
        city: formData.city || 'London',
        postal_code: formData.postal_code || null,
        country: formData.country || 'United Kingdom',
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
        medical_allergies: formData.medical_allergies || 'None recorded',
        role: formData.role || 'client',
        status: formData.status || 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (profileError) {
      console.error('Error updating created profile:', profileError)
    }

    revalidatePath('/admin')
    revalidatePath('/admin/clients')
    return { success: true, data: updatedProfile, tempPassword }
  } catch (err: any) {
    console.error('Exception creating client record:', err)
    return { success: false, error: err?.message || 'Unknown error' }
  }
}

export async function deleteClientRecord(id: string) {
  try {
    const adminSupabase = createAdminClient()

    // Check if client has bookings
    const { data: bookings } = await adminSupabase
      .from('bookings')
      .select('id')
      .eq('client_id', id)
      .limit(1)

    if (bookings && bookings.length > 0) {
      // Archive account instead of breaking relational integrity
      return await updateClientStatus(id, 'suspended', 'Client record archived by clinic administration.')
    }

    // Delete auth user which cascades to profiles
    const { error } = await adminSupabase.auth.admin.deleteUser(id)
    if (error) {
      const { error: profileDeleteError } = await adminSupabase.from('profiles').delete().eq('id', id)
      if (profileDeleteError) {
        return { success: false, error: profileDeleteError.message }
      }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/clients')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete client' }
  }
}
