import { Suspense } from 'react'
import { SessionsManager } from '@/components/admin/sessions-manager'
import { getSessionCategories, getSessions } from '@/actions/admin-sessions'

export const metadata = {
  title: 'Sessions & Categories | Auralixa Aesthetics Admin',
  description: 'Manage clinical treatments catalog and taxonomy categories.',
}

export default async function SessionsPage() {
  const [categories, sessions] = await Promise.all([
    getSessionCategories(),
    getSessions(),
  ])

  // Map Supabase rows to client model format
  const mappedCategories = (categories || []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    default_duration_minutes: cat.default_duration_minutes || 60,
    buffer_minutes: cat.buffer_minutes || 15,
    is_active: cat.is_active,
  }))

  const mappedSessions = (sessions || []).map((s: any) => ({
    id: s.id,
    session_type_id: s.session_type_id || '',
    category_name: s.session_types?.name || 'General Aesthetics',
    title: s.title,
    slug: s.slug,
    description: s.description || '',
    benefits: s.benefits || [],
    pricing: Number(s.pricing),
    currency: s.currency || 'GBP',
    duration_minutes: s.duration_minutes,
    buffer_minutes: s.session_types?.buffer_minutes || 15,
    max_slots: s.max_slots,
    location: s.location || 'Harley Street Clinic, Suite 4B',
    status: s.status,
    is_ongoing: s.is_ongoing,
    image_url: s.image_url || undefined,
  }))

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-foreground/50">
          Loading treatments & categories catalog...
        </div>
      }
    >
      <SessionsManager
        initialCategories={mappedCategories}
        initialSessions={mappedSessions}
      />
    </Suspense>
  )
}
