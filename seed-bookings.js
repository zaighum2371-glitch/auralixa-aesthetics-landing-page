import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy'

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: clients, error: clientsError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role')
    .eq('role', 'client')
    .limit(2)

  if (clientsError) {
    console.error("Error fetching clients:", clientsError)
    return
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('id, title, pricing')
    .limit(2)

  if (sessionsError) {
    console.error("Error fetching sessions:", sessionsError)
    return
  }

  console.log("Clients:", clients)
  console.log("Sessions:", sessions)

  if (!clients || clients.length === 0 || !sessions || sessions.length === 0) {
    console.log("Not enough data to create bookings")
    return
  }

  const newBookings = [
    {
      booking_reference: 'AUR-00001',
      client_id: clients[0].id,
      session_id: sessions[0].id,
      appointment_date: '2026-10-15',
      start_time: '14:00:00',
      end_time: '15:00:00',
      total_price: sessions[0].pricing,
      status: 'confirmed',
      payment_status: 'pending_in_person'
    },
    {
      booking_reference: 'AUR-00002',
      client_id: clients[clients.length > 1 ? 1 : 0].id,
      session_id: sessions[sessions.length > 1 ? 1 : 0].id,
      appointment_date: '2026-10-16',
      start_time: '10:00:00',
      end_time: '11:30:00',
      total_price: sessions[sessions.length > 1 ? 1 : 0].pricing,
      status: 'pending',
      payment_status: 'pending_in_person'
    },
    {
      booking_reference: 'AUR-00003',
      client_id: clients[0].id,
      session_id: sessions[0].id,
      appointment_date: '2026-09-10',
      start_time: '09:00:00',
      end_time: '10:00:00',
      total_price: sessions[0].pricing,
      status: 'completed',
      payment_status: 'paid_in_person'
    }
  ]

  const { data: inserted, error: insertError } = await supabase
    .from('bookings')
    .insert(newBookings)
    .select()

  if (insertError) {
    console.error("Error inserting bookings:", insertError)
  } else {
    console.log("Successfully created bookings:", inserted)
  }
}

main()
