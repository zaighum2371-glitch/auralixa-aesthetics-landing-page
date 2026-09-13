import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { extractStoragePath } from '@/lib/supabase/avatar'
import { AdminOverview } from '@/components/admin/admin-overview'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch all profiles from Supabase for live role management testing
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const userList = profiles || []

  // Batch resolve signed URLs for users with avatars stored in private bucket
  const avatarPaths = userList
    .map((p) => extractStoragePath(p.avatar_url))
    .filter((p): p is string => Boolean(p))

  const signedUrlMap: Record<string, string> = {}
  if (avatarPaths.length > 0) {
    try {
      const { data: signedData } = await supabase.storage
        .from('avatars')
        .createSignedUrls(avatarPaths, 60 * 60 * 24)

      if (signedData) {
        signedData.forEach((item) => {
          if (item.signedUrl && item.path) {
            signedUrlMap[item.path] = item.signedUrl
          }
        })
      }
    } catch (err) {
      console.error('Failed to create signed URLs for admin view:', err)
    }
  }

  // Server Action to update user role for testing
  async function updateUserRole(userId: string, newRole: 'user' | 'client' | 'admin') {
    'use server'
    const adminSupabase = await createClient()
    await adminSupabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    revalidatePath('/admin')
    revalidatePath('/dashboard')
  }

  return (
    <AdminOverview
      userList={userList}
      signedUrlMap={signedUrlMap}
      updateUserRole={updateUserRole}
    />
  )
}
