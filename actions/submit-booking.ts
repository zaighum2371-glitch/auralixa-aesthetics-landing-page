'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function submitBooking(formData: {
  treatment: string
  date: string
  time: string
  firstName: string
  lastName: string
  email: string
  phone: string
  concerns: string
}) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  // 1. Get the session ID for the selected treatment
  const { data: session } = await supabase
    .from('sessions')
    .select('id, duration_minutes, pricing')
    .eq('title', formData.treatment)
    .single()

  if (!session) {
    throw new Error('Treatment not found')
  }

  // 2. Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  let clientId = user?.id

  // 3. If not logged in, find or create the guest profile
  if (!clientId) {
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', formData.email.toLowerCase().trim())
      .single()

    if (existingProfile) {
      clientId = existingProfile.id
    } else {
      // Create a dummy auth user which triggers the profile creation
      const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email.toLowerCase().trim(),
        password: crypto.randomUUID(),
        email_confirm: true,
        user_metadata: { role: 'client' }
      })

      if (createErr || !newUser.user) {
        throw new Error('Failed to create guest user profile')
      }

      clientId = newUser.user.id
    }
  }

  // 4. Update the profile with the provided details
  await supabaseAdmin
    .from('profiles')
    .update({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone
    })
    .eq('id', clientId)

  // 5. Calculate end time
  const [hours, minutes] = formData.time.split(':').map(Number)
  const startDate = new Date(`${formData.date}T${formData.time}:00`)
  const endDate = new Date(startDate.getTime() + (session.duration_minutes || 60) * 60000)
  
  const endHours = endDate.getHours().toString().padStart(2, '0')
  const endMinutes = endDate.getMinutes().toString().padStart(2, '0')
  const endTimeStr = `${endHours}:${endMinutes}:00`

  // 6. Generate a booking reference
  const ref = 'BKG-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  // 7. Insert the booking
  const { data: newBooking, error: insertErr } = await supabaseAdmin
    .from('bookings')
    .insert({
      booking_reference: ref,
      client_id: clientId,
      session_id: session.id,
      appointment_date: formData.date,
      start_time: `${formData.time}:00`,
      end_time: endTimeStr,
      status: 'pending',
      payment_status: 'pending_in_person',
      total_price: session.pricing || 150.0,
      client_notes: formData.concerns
    })
    .select('id')
    .single()

  if (insertErr || !newBooking) {
    throw new Error('Failed to insert booking: ' + (insertErr?.message || 'Unknown error'))
  }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/clients')

  return { 
    success: true, 
    booking_reference: ref,
    booking_id: newBooking.id,
    price: session.pricing || 150.0,
    treatment: formData.treatment
  }
}
