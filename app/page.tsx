import { PageContent } from '@/components/page-content'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function Page() {
  const supabase = await createClient()

  const [
    { data: sessionTypes },
    { data: sessions }
  ] = await Promise.all([
    supabase.from('session_types').select('*').order('name'),
    supabase.from('sessions').select('*').in('status', ['active', 'draft'])
  ])

  return <PageContent sessionTypes={sessionTypes || []} sessions={sessions || []} />
}
