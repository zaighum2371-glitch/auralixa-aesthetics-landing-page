import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy'

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log("Querying bookings...");
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      client:profiles!bookings_client_id_fkey(id, first_name, last_name, email, phone, medical_allergies),
      session:sessions!bookings_session_id_fkey(id, title, pricing, duration_minutes, location, session_types(name))
    `)
    .limit(1)

  if (error) {
    console.error("ERROR:", error);
  } else {
    console.log("SUCCESS");
  }
}

main()
