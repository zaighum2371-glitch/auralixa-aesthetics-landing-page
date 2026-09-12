import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}

envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=')
  if (key && vals.length > 0) {
    env[key.trim()] = vals.join('=').trim()
  }
})

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedAdmin() {
  const adminEmail = 'admin@auralixa.com'
  const adminPassword = 'AuralixaAdmin2026!'

  console.log(`Creating admin user: ${adminEmail}...`)

  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      first_name: 'Clinic',
      last_name: 'Administrator',
      role: 'admin'
    }
  })

  if (createError) {
    console.error('Error creating admin user:', createError.message)
    process.exit(1)
  }

  console.log('Admin user created successfully in auth.users with ID:', user.user.id)

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin', status: 'active' })
    .eq('id', user.user.id)

  if (profileError) {
    console.error('Error updating profile role:', profileError.message)
    process.exit(1)
  }

  console.log('Profile role confirmed as "admin"!')
}

seedAdmin()
