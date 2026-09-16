'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getClientAvailableSessions() {
  const supabase = await createClient()

  // Ensure user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*, session_types(name)')
    .eq('status', 'active')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching sessions:', error)
    throw new Error('Failed to fetch available sessions')
  }

  return data
}

export async function createClientBooking(payload: {
  session_id: string
  appointment_date: string
  start_time: string
  end_time: string
  client_notes?: string
  total_price: number
  slot_count: number
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Generate a random 6-character alphanumeric reference
  const randomRef = Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      client_id: user.id,
      session_id: payload.session_id,
      appointment_date: payload.appointment_date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      client_notes: payload.client_notes,
      total_price: payload.total_price,
      slot_count: payload.slot_count,
      booking_reference: randomRef,
      status: 'pending',
      payment_status: 'pending_in_person'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating booking:', error)
    return { success: false, error: error.message }
  }

  // Log in history
  await supabase.from('booking_history').insert({
    booking_id: booking.id,
    changed_by: user.id,
    new_status: 'pending',
    new_payment_status: 'pending_in_person',
    reason: 'Client requested booking via dashboard'
  })

  revalidatePath('/dashboard')
  revalidatePath('/admin/bookings')

  return { success: true, booking }
}
