import re

with open("actions/admin-sessions.ts", "r") as f:
    content = f.read()

helper = """import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function getAdminClient() {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return null
  const { data: profile } = await client.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return { supabase: createAdminClient(), user }
}

// Category Actions"""

content = content.replace("import { createAdminClient } from '@/lib/supabase/admin'\nimport { revalidatePath } from 'next/cache'\n\n// Category Actions", helper)

content = re.sub(r'{\n  const supabase = await createClient\(\)\n  const { data: { user } } = await supabase.auth.getUser\(\)', r"{\n  const adminAuth = await getAdminClient()\n  if (!adminAuth) return { success: false, error: 'Unauthorized' }\n  const { supabase, user } = adminAuth", content)

content = re.sub(r'{\n  const supabase = await createClient\(\)', r"{\n  const adminAuth = await getAdminClient()\n  if (!adminAuth) return { success: false, error: 'Unauthorized' }\n  const { supabase } = adminAuth", content)

with open("actions/admin-sessions.ts", "w") as f:
    f.write(content)

print("Done")
