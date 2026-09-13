import type { SupabaseClient } from '@supabase/supabase-js'

const AVATAR_BUCKET = 'avatars'
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * Extracts relative storage path if the given string is a path or full storage URL.
 */
export function extractStoragePath(pathOrUrl: string | null): string | null {
  if (!pathOrUrl) return null
  const trimmed = pathOrUrl.trim()
  if (!trimmed) return null

  // If it's a full storage URL
  if (trimmed.includes(`/storage/v1/object/`)) {
    const parts = trimmed.split(`/${AVATAR_BUCKET}/`)
    if (parts.length > 1) {
      return parts[1].split('?')[0]
    }
  }

  // If it starts with avatars/ prefix
  if (trimmed.startsWith(`${AVATAR_BUCKET}/`)) {
    return trimmed.slice(`${AVATAR_BUCKET}/`.length)
  }

  // If it's already an external non-storage URL, return null for storage resolution
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return null
  }

  return trimmed
}

/**
 * Resolves an avatar URL into a valid displayable signed URL if it is stored in Supabase private bucket,
 * or returns the URL as-is if it is an external URL / data URI.
 */
export async function getAvatarSignedUrl(
  supabase: SupabaseClient<any, any, any>,
  pathOrUrl: string | null,
  expiresIn: number = 60 * 60 * 24 // 24 hours
): Promise<string | null> {
  if (!pathOrUrl) return null
  const trimmed = pathOrUrl.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed
  }

  const storagePath = extractStoragePath(trimmed)

  // If not a storage path and is an external URL, return directly
  if (!storagePath) {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed
    }
    return null
  }

  try {
    const { data, error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .createSignedUrl(storagePath, expiresIn)

    if (error || !data?.signedUrl) {
      console.warn('Could not generate signed avatar URL:', error?.message)
      return null
    }

    return data.signedUrl
  } catch (err) {
    console.error('Error in getAvatarSignedUrl:', err)
    return null
  }
}

/**
 * Uploads an image to the private avatars bucket under {userId}/{filename}
 */
export async function uploadAvatar(
  supabase: SupabaseClient<any, any, any>,
  userId: string,
  file: File
): Promise<{ path: string; signedUrl: string }> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, WebP, or GIF).')
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Image size must be less than 5MB.')
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `avatar-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    throw new Error(uploadError.message || 'Failed to upload avatar.')
  }

  // Create signed URL for instant display
  const { data: signedData, error: signError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days

  if (signError || !signedData?.signedUrl) {
    throw new Error('Image uploaded, but failed to create secure view link.')
  }

  return {
    path: filePath,
    signedUrl: signedData.signedUrl,
  }
}
