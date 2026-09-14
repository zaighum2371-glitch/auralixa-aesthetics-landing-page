'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getBookings(filters?: {
  status?: string
  paymentStatus?: string
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(`
      *,
      client:profiles!bookings_client_id_fkey(id, first_name, last_name, email, phone, medical_allergies),
      session:sessions!bookings_session_id_fkey(id, title, pricing, duration_minutes, location, session_types(name))
    `)
    .order('appointment_date', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    if (filters.status === 'cancelled') {
      query = query.or('status.eq.cancelled_by_admin,status.eq.cancelled_by_client,status.eq.no_show')
    } else {
      query = query.eq('status', filters.status as any)
    }
  }

  if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
    query = query.eq('payment_status', filters.paymentStatus as any)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }

  return data
}

export async function createAdminBooking(formData: {
  client_id: string
  session_id: string
  appointment_date: string
  start_time: string
  end_time: string
  total_price: number
  status?: 'pending' | 'confirmed' | 'completed' | 'no_show' | 'cancelled_by_admin' | 'cancelled_by_client'
  payment_status?: 'pending_in_person' | 'paid_in_person' | 'waived' | 'refunded_in_person'
  client_notes?: string
  admin_notes?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const randomRef = `AUR-${Math.floor(10000 + Math.random() * 90000)}`

  const { data: newBooking, error } = await supabase
    .from('bookings')
    .insert({
      booking_reference: randomRef,
      client_id: formData.client_id,
      session_id: formData.session_id,
      appointment_date: formData.appointment_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      total_price: formData.total_price,
      status: formData.status || 'confirmed',
      payment_status: formData.payment_status || 'pending_in_person',
      client_notes: formData.client_notes || null,
      admin_notes: formData.admin_notes || null,
    })
    .select()
    .single()

  if (error || !newBooking) {
    console.error('Error creating booking:', error)
    return { success: false, error: error?.message || 'Failed to create booking' }
  }

  // Audit trail
  if (user) {
    await supabase.from('booking_history').insert({
      booking_id: newBooking.id,
      changed_by: user.id,
      old_status: null,
      new_status: newBooking.status,
      old_payment_status: null,
      new_payment_status: newBooking.payment_status,
      reason: 'Administrative booking creation',
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/clients')
  return { success: true, data: newBooking }
}

export async function updateBookingStatus(
  id: string,
  newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_admin' | 'cancelled_by_client' | 'no_show',
  cancelReason?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch current state for audit diff
  const { data: current } = await supabase
    .from('bookings')
    .select('status, payment_status')
    .eq('id', id)
    .single()

  const isCancel = newStatus === 'cancelled_by_admin' || newStatus === 'cancelled_by_client'

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      status: newStatus,
      cancel_reason: isCancel ? cancelReason || 'Cancelled by staff' : null,
      cancelled_at: isCancel ? new Date().toISOString() : null,
      cancelled_by: isCancel && user ? user.id : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) {
    return { success: false, error: error?.message }
  }

  // Record in booking_history
  if (user && current) {
    await supabase.from('booking_history').insert({
      booking_id: id,
      changed_by: user.id,
      old_status: current.status,
      new_status: newStatus,
      old_payment_status: current.payment_status,
      new_payment_status: current.payment_status,
      reason: cancelReason || `Status updated to ${newStatus}`,
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/clients')
  return { success: true, data: updated }
}

export async function settleInPersonPayment(id: string, paymentMethodNote: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: current } = await supabase
    .from('bookings')
    .select('status, payment_status, total_price, client_id')
    .eq('id', id)
    .single()

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      payment_status: 'paid_in_person',
      payment_method_note: paymentMethodNote,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) {
    return { success: false, error: error?.message }
  }

  // Record audit log
  if (user && current) {
    await supabase.from('booking_history').insert({
      booking_id: id,
      changed_by: user.id,
      old_status: current.status,
      new_status: current.status,
      old_payment_status: current.payment_status,
      new_payment_status: 'paid_in_person',
      reason: `Desk Settlement: ${paymentMethodNote}`,
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/clients')
  return { success: true, data: updated }
}

export async function updateBookingDetails(
  id: string,
  updates: {
    appointment_date?: string
    start_time?: string
    end_time?: string
    total_price?: number
    client_notes?: string | null
    admin_notes?: string | null
  }
) {
  const supabase = await createClient()
  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) {
    return { success: false, error: error?.message }
  }

  revalidatePath('/admin/bookings')
  return { success: true, data: updated }
}

export async function deleteBooking(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')
  return { success: true }
}
