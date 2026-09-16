'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

// Category Actions
export async function getSessionCategories() {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    supabase = createAdminClient()
  }

  let { data, error } = await supabase
    .from('session_types')
    .select('*')
    .order('name', { ascending: true })

  if (error || !data) {
    try {
      const adminClient = createAdminClient()
      const res = await adminClient
        .from('session_types')
        .select('*')
        .order('name', { ascending: true })
      if (res.data) {
        data = res.data
        error = null
      }
    } catch (e) {
      console.error('Fallback admin categories fetch failed:', e)
    }
  }

  if (error) {
    console.error('Failed to get session categories:', error?.message || error)
    return []
  }
  return data || []
}

export async function createSessionCategory(formData: {
  name: string
  slug?: string
  description?: string
  default_duration_minutes?: number
  buffer_minutes?: number
  is_active?: boolean
}) {
  const supabase = await createClient()
  const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const { data, error } = await supabase
    .from('session_types')
    .insert({
      name: formData.name,
      slug,
      description: formData.description || null,
      default_duration_minutes: formData.default_duration_minutes || 60,
      buffer_minutes: formData.buffer_minutes || 15,
      is_active: formData.is_active !== undefined ? formData.is_active : true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/sessions')
  return { success: true, data }
}

export async function updateSessionCategory(
  id: string,
  updates: {
    name?: string
    slug?: string
    description?: string
    default_duration_minutes?: number
    buffer_minutes?: number
    is_active?: boolean
  }
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('session_types')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating category:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/sessions')
  return { success: true, data }
}

export async function deleteSessionCategory(id: string) {
  const supabase = await createClient()

  // Check if treatments belong to this category
  const { count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('session_type_id', id)

  if (count && count > 0) {
    // Soft disable instead of breaking foreign keys
    await supabase
      .from('session_types')
      .update({ is_active: false })
      .eq('id', id)

    revalidatePath('/admin/sessions')
    return {
      success: true,
      message: 'Category has treatments assigned; disabled instead of deleted.',
    }
  }

  const { error } = await supabase.from('session_types').delete().eq('id', id)
  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/sessions')
  return { success: true }
}

// Session (Treatment) Actions
export async function getSessions(filters?: {
  categoryId?: string
  status?: string
  search?: string
}) {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    supabase = createAdminClient()
  }

  let query = supabase
    .from('sessions')
    .select('*, session_types(id, name, slug), bookings(count)')
    .order('created_at', { ascending: false })

  if (filters?.categoryId && filters.categoryId !== 'all') {
    query = query.eq('session_type_id', filters.categoryId)
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status as any)
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }

  let { data, error } = await query

  if (error || !data) {
    try {
      const adminClient = createAdminClient()
      let fallbackQuery = adminClient
        .from('sessions')
        .select('*, session_types(id, name, slug), bookings(count)')
        .order('created_at', { ascending: false })

      if (filters?.categoryId && filters.categoryId !== 'all') {
        fallbackQuery = fallbackQuery.eq('session_type_id', filters.categoryId)
      }

      if (filters?.status && filters.status !== 'all') {
        fallbackQuery = fallbackQuery.eq('status', filters.status as any)
      }

      if (filters?.search) {
        fallbackQuery = fallbackQuery.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      const res = await fallbackQuery
      if (res.data) {
        data = res.data
        error = null
      }
    } catch (e) {
      console.error('Fallback admin sessions fetch failed:', e)
    }
  }

  if (error) {
    console.error('Error fetching sessions:', error?.message || error)
    return []
  }
  return data || []
}

export async function createSession(formData: {
  title: string
  slug?: string
  session_type_id?: string
  description?: string
  benefits?: string[]
  pricing: number
  currency?: string
  duration_minutes: number
  buffer_minutes?: number
  max_slots?: number
  location?: string
  status?: 'active' | 'draft' | 'archived'
  is_ongoing?: boolean
  post_care_instructions?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const { data: newSession, error } = await supabase
    .from('sessions')
    .insert({
      title: formData.title,
      slug,
      session_type_id: formData.session_type_id || null,
      description: formData.description || null,
      benefits: formData.benefits || [],
      pricing: formData.pricing,
      currency: formData.currency || 'GBP',
      duration_minutes: formData.duration_minutes,
      max_slots: formData.max_slots || 4,
      location: formData.location || 'Castlemere Community Centre, Rochdale',
      status: formData.status || 'active',
      is_ongoing: formData.is_ongoing !== undefined ? formData.is_ongoing : true,
      post_care_instructions: formData.post_care_instructions || null,
    })
    .select()
    .single()

  if (error || !newSession) {
    console.error('Error creating session:', error)
    return { success: false, error: error?.message || 'Failed to create treatment' }
  }

  // Audit trail log
  if (user) {
    await supabase.from('session_history').insert({
      session_id: newSession.id,
      action: 'created',
      changed_by: user.id,
      change_summary: `Treatment "${newSession.title}" added to catalog (£${newSession.pricing.toFixed(2)}).`,
      diff_snapshot: newSession as any,
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/sessions')
  return { success: true, data: newSession }
}

export async function updateSession(
  id: string,
  updates: {
    title?: string
    slug?: string
    session_type_id?: string
    description?: string
    benefits?: string[]
    pricing?: number
    currency?: string
    duration_minutes?: number
    buffer_minutes?: number
    max_slots?: number
    location?: string
    status?: 'active' | 'draft' | 'archived'
    is_ongoing?: boolean
    post_care_instructions?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { buffer_minutes, ...validUpdates } = updates;
  const { data: updated, error } = await supabase
    .from('sessions')
    .update({
      ...validUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) {
    console.error('Error updating session:', error)
    return { success: false, error: error?.message || 'Failed to update treatment' }
  }

  // Audit trail log
  if (user) {
    await supabase.from('session_history').insert({
      session_id: id,
      action: 'updated',
      changed_by: user.id,
      change_summary: `Treatment "${updated.title}" parameters updated.`,
      diff_snapshot: updates as any,
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/sessions')
  return { success: true, data: updated }
}

export async function archiveSession(id: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: archived, error } = await supabase
    .from('sessions')
    .update({
      status: 'archived',
      cancel_reason: reason,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error || !archived) {
    return { success: false, error: error?.message }
  }

  if (user) {
    await supabase.from('session_history').insert({
      session_id: id,
      action: 'archived',
      changed_by: user.id,
      change_summary: `Treatment archived. Reason: ${reason}`,
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/sessions')
  return { success: true, data: archived }
}

export async function deleteSession(id: string) {
  const supabase = await createClient()

  // Check if bookings are attached
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', id)

  if (count && count > 0) {
    return archiveSession(id, 'Auto-archived as appointment records exist')
  }

  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/sessions')
  return { success: true }
}
