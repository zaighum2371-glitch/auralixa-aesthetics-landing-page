'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAvatarSignedUrl, uploadAvatar } from '@/lib/supabase/avatar'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  HeartHandshake, 
  AlertTriangle,
  Camera,
  Upload,
  Trash2
} from 'lucide-react'

interface ProfileData {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  avatar_url: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_allergies: string | null
  role: 'user' | 'client' | 'admin'
  status: string
  created_at: string
}

export function ProfileForm({ initialProfile }: { initialProfile: ProfileData }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    firstName: initialProfile.first_name || '',
    lastName: initialProfile.last_name || '',
    phone: initialProfile.phone || '',
    dateOfBirth: initialProfile.date_of_birth || '',
    avatarUrl: initialProfile.avatar_url || '',
    emergencyContactName: initialProfile.emergency_contact_name || '',
    emergencyContactPhone: initialProfile.emergency_contact_phone || '',
    medicalAllergies: initialProfile.medical_allergies || '',
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Resolve signed avatar URL on mount or when avatar_url changes
  useEffect(() => {
    let isMounted = true
    async function loadAvatar() {
      if (!initialProfile.avatar_url) {
        setAvatarPreview(null)
        return
      }
      const supabase = createClient()
      const signed = await getAvatarSignedUrl(supabase, initialProfile.avatar_url)
      if (isMounted) {
        setAvatarPreview(signed)
      }
    }
    loadAvatar()
    return () => {
      isMounted = false
    }
  }, [initialProfile.avatar_url])

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { path, signedUrl } = await uploadAvatar(supabase, initialProfile.id, file)

      // Update database profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: path })
        .eq('id', initialProfile.id)

      if (updateError) {
        throw updateError
      }

      setFormData((prev) => ({ ...prev, avatarUrl: path }))
      setAvatarPreview(signedUrl)
      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to upload profile picture.')
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!formData.avatarUrl && !avatarPreview) return

    setUploadingAvatar(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', initialProfile.id)

      if (updateError) {
        throw updateError
      }

      setFormData((prev) => ({ ...prev, avatarUrl: '' }))
      setAvatarPreview(null)
      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to remove profile picture.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setSuccess(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName.trim() || null,
          last_name: formData.lastName.trim() || null,
          phone: formData.phone.trim() || null,
          date_of_birth: formData.dateOfBirth || null,
          avatar_url: formData.avatarUrl.trim() || null,
          emergency_contact_name: formData.emergencyContactName.trim() || null,
          emergency_contact_phone: formData.emergencyContactPhone.trim() || null,
          medical_allergies: formData.medicalAllergies.trim() || null,
        })
        .eq('id', initialProfile.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred while saving profile.')
    } finally {
      setLoading(false)
    }
  }

  const initials = [formData.firstName?.[0], formData.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || initialProfile.email?.[0]?.toUpperCase() || 'U'

  const roleBadge = initialProfile.role === 'admin'
    ? { text: 'Clinic Administrator', bg: 'bg-purple-500/10 text-purple-700 border-purple-500/20' }
    : initialProfile.role === 'client'
    ? { text: 'Auralixa Client', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' }
    : { text: 'Standard Member', bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20' }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-800 text-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header Profile Summary Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleAvatarFileChange}
          disabled={uploadingAvatar}
        />

        {/* Avatar Display / Hover Trigger */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div
            onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
            className="relative group shrink-0 cursor-pointer"
            title="Click to change profile picture"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gold/40 shadow-sm transition-opacity group-hover:opacity-80"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground font-serif text-2xl font-medium flex items-center justify-center border-2 border-gold/40 shadow-sm group-hover:bg-primary/90 transition-colors">
                {initials}
              </div>
            )}

            {/* Hover / Loading Overlay */}
            <div className={`absolute inset-0 rounded-full bg-black/45 flex flex-col items-center justify-center text-white transition-opacity ${uploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {uploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin text-gold" />
              ) : (
                <>
                  <Camera className="w-5 h-5 text-gold" />
                  <span className="text-[10px] font-medium tracking-wide mt-0.5">Change</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border border-border hover:border-gold hover:bg-muted/50 text-foreground transition-all disabled:opacity-50 cursor-pointer"
            >
              <Upload className="w-3 h-3 text-gold" />
              <span>{uploadingAvatar ? 'Uploading...' : 'Upload'}</span>
            </button>
            {(avatarPreview || formData.avatarUrl) && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={uploadingAvatar}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-border/60 hover:border-destructive hover:bg-destructive/10 text-destructive/80 hover:text-destructive transition-all disabled:opacity-50 cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-3 h-3" />
                <span className="sr-only sm:not-sr-only">Remove</span>
              </button>
            )}
          </div>
        </div>

        <div className="text-center sm:text-left space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border ${roleBadge.bg}`}>
              {initialProfile.role === 'admin' ? (
                <Shield className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-gold" />
              )}
              {roleBadge.text}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 capitalize">
              Status: {initialProfile.status}
            </span>
          </div>

          <h2 className="font-serif text-2xl font-medium text-foreground">
            {formData.firstName || formData.lastName
              ? `${formData.firstName} ${formData.lastName}`.trim()
              : 'Client Profile'}
          </h2>

          <p className="text-sm text-foreground/60">
            {initialProfile.email}
          </p>

          <p className="text-xs text-foreground/40">
            Member since {new Date(initialProfile.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          <div className="pt-2 border-t border-border/40 text-[11px] text-foreground/60 flex items-center justify-center sm:justify-start gap-1.5">
            <Shield className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>
              Profile photo stored in private cloud storage. Visible only to you and clinic administrators.
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Personal Details */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-gold" />
            <span>Personal Information</span>
          </h3>
          <p className="text-xs text-foreground/60 mt-1">
            Update your name and primary contact details for clinic records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Sophia"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Laurent"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Email Address (Account ID)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={initialProfile.email || ''}
                className="w-full pl-10 pr-3.5 py-2.5 bg-muted/40 border border-border/60 rounded-lg text-sm text-foreground/60 cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Email is managed by Supabase authentication and cannot be altered here.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+44 7700 900077"
                className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Profile Photo Vault Status
            </label>
            <div className="relative flex items-center gap-3 px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground">
              <Camera className="w-4 h-4 text-gold shrink-0" />
              <div className="flex-1 truncate">
                {formData.avatarUrl ? (
                  <span className="font-mono text-xs text-foreground/80 truncate block">
                    {formData.avatarUrl}
                  </span>
                ) : (
                  <span className="text-foreground/40 text-xs italic">
                    No photo uploaded (using default initials)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-gold hover:underline font-medium shrink-0 cursor-pointer"
              >
                {formData.avatarUrl ? 'Change' : 'Upload'}
              </button>
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              PNG, JPG, WebP, or GIF up to 5MB. Private Supabase bucket storage.
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Clinical Care & Emergency Contact */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-gold" />
            <span>Emergency Contact & Clinical Preferences</span>
          </h3>
          <p className="text-xs text-foreground/60 mt-1">
            Required for safe clinical procedure administration and medical-grade aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Emergency Contact Name
            </label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Emergency Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                placeholder="+44 7700 900088"
                className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Medical & Skin Allergies (Contraindications)</span>
            </label>
            <textarea
              name="medicalAllergies"
              rows={3}
              value={formData.medicalAllergies}
              onChange={handleChange}
              placeholder="List any sensitivities, latex allergies, skin conditions, active medications, or previous adverse reactions..."
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
            <span className="text-[11px] text-foreground/50 mt-1 block">
              This information is kept confidential and reviewed prior to treatments.
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-lg font-medium shadow-sm transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Profile...
            </span>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
}
