'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAvatarSignedUrl, uploadAvatar } from '@/lib/supabase/avatar'
import { Button } from '@/components/ui/button'
import type { ProfileRow, ProfileUpdate, UserRole, UserStatus } from '@/types/database'
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
  Trash2,
  Copy,
  Check,
  Clock,
  Fingerprint,
  FileBadge2,
  ShieldCheck,
  ShieldAlert,
  Lock,
  UserCog,
  Ban,
  MapPin,
  Building,
  Globe
} from 'lucide-react'

export type ProfileData = ProfileRow

function formatForDateTimeLocal(dateStr: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ''
  }
}

export function ProfileForm({ initialProfile }: { initialProfile: ProfileData }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isAdmin = initialProfile.role === 'admin'

  const [formData, setFormData] = useState({
    firstName: initialProfile.first_name || '',
    lastName: initialProfile.last_name || '',
    phone: initialProfile.phone || '',
    dateOfBirth: initialProfile.date_of_birth || '',
    avatarUrl: initialProfile.avatar_url || '',
    // Address Details
    addressLine1: initialProfile.address_line1 || '',
    addressLine2: initialProfile.address_line2 || '',
    city: initialProfile.city || '',
    state: initialProfile.state || '',
    postalCode: initialProfile.postal_code || '',
    country: initialProfile.country || 'United Kingdom',
    // Clinical & Emergency
    emergencyContactName: initialProfile.emergency_contact_name || '',
    emergencyContactPhone: initialProfile.emergency_contact_phone || '',
    medicalAllergies: initialProfile.medical_allergies || '',
    // Roles & Moderation
    role: initialProfile.role || 'user',
    status: initialProfile.status || 'active',
    banReason: initialProfile.ban_reason || '',
    bannedAt: formatForDateTimeLocal(initialProfile.banned_at),
    bannedBy: initialProfile.banned_by || '',
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>(initialProfile.updated_at)

  // Resolve signed avatar URL on mount or when avatar_url changes
  useEffect(() => {
    let isMounted = true
    async function loadAvatar() {
      if (!formData.avatarUrl) {
        setAvatarPreview(null)
        return
      }
      const supabase = createClient()
      const signed = await getAvatarSignedUrl(supabase, formData.avatarUrl)
      if (isMounted) {
        setAvatarPreview(signed)
      }
    }
    loadAvatar()
    return () => {
      isMounted = false
    }
  }, [formData.avatarUrl])

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(initialProfile.id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } catch {
      // Clipboard fallback
    }
  }

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { path, signedUrl } = await uploadAvatar(supabase, initialProfile.id, file)

      const timestamp = new Date().toISOString()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: path,
          updated_at: timestamp
        })
        .eq('id', initialProfile.id)

      if (updateError) {
        throw updateError
      }

      setFormData((prev) => ({ ...prev, avatarUrl: path }))
      setAvatarPreview(signedUrl)
      setLastUpdatedAt(timestamp)
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
      const timestamp = new Date().toISOString()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: timestamp
        })
        .eq('id', initialProfile.id)

      if (updateError) {
        throw updateError
      }

      setFormData((prev) => ({ ...prev, avatarUrl: '' }))
      setAvatarPreview(null)
      setLastUpdatedAt(timestamp)
      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to remove profile picture.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setSuccess(false)
    setError(null)
  }

  const handleSetBannedAtNow = () => {
    const now = formatForDateTimeLocal(new Date().toISOString())
    setFormData((prev) => ({ ...prev, bannedAt: now }))
  }

  const handleClearBannedAt = () => {
    setFormData((prev) => ({ ...prev, bannedAt: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    // Validate UUID for banned_by if provided
    const isValidUuid = (id: string) => 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim())

    let sanitizedBannedBy: string | null = null
    if (formData.bannedBy.trim()) {
      if (!isValidUuid(formData.bannedBy)) {
        setError('Banned By must be a valid UUID or left blank.')
        setLoading(false)
        return
      }
      sanitizedBannedBy = formData.bannedBy.trim()
    }

    try {
      const supabase = createClient()
      const timestamp = new Date().toISOString()

      const updatePayload: ProfileUpdate = {
        first_name: formData.firstName.trim() || null,
        last_name: formData.lastName.trim() || null,
        phone: formData.phone.trim() || null,
        date_of_birth: formData.dateOfBirth || null,
        avatar_url: formData.avatarUrl.trim() || null,
        // Address details
        address_line1: formData.addressLine1.trim() || null,
        address_line2: formData.addressLine2.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        postal_code: formData.postalCode.trim() || null,
        country: formData.country.trim() || null,
        // Clinical details
        emergency_contact_name: formData.emergencyContactName.trim() || null,
        emergency_contact_phone: formData.emergencyContactPhone.trim() || null,
        medical_allergies: formData.medicalAllergies.trim() || null,
        updated_at: timestamp,
      }

      // Administrative fields are strictly restricted to administrator accounts
      if (isAdmin) {
        updatePayload.role = formData.role as UserRole
        updatePayload.status = formData.status as UserStatus
        updatePayload.ban_reason = formData.banReason.trim() || null
        updatePayload.banned_at = formData.bannedAt ? new Date(formData.bannedAt).toISOString() : null
        updatePayload.banned_by = sanitizedBannedBy
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', initialProfile.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setLastUpdatedAt(timestamp)
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

  const roleBadge = formData.role === 'admin'
    ? { text: 'Clinic Administrator', bg: 'bg-purple-500/10 text-purple-700 border-purple-500/20' }
    : formData.role === 'client'
    ? { text: 'Auralixa Client', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' }
    : { text: 'Standard Member', bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20' }

  const statusBadge = formData.status === 'active'
    ? { text: 'Active Account', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' }
    : formData.status === 'suspended'
    ? { text: 'Suspended', bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20' }
    : formData.status === 'banned'
    ? { text: 'Banned', bg: 'bg-destructive/10 text-destructive border-destructive/20' }
    : { text: 'Rejected', bg: 'bg-destructive/10 text-destructive border-destructive/20' }

  const isRestricted = formData.status !== 'active'

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not on file'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    } catch {
      return dateStr
    }
  }

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Not on file'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      const pad = (n: number) => n.toString().padStart(2, '0')
      return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
    } catch {
      return dateStr
    }
  }

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

      {/* Account Standing / Moderation Banner (if restricted) */}
      {isRestricted && (
        <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/30 space-y-3">
          <div className="flex items-center gap-2.5 text-destructive font-medium">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="font-serif text-base">Account Notice: Status is currently {formData.status.toUpperCase()}</span>
          </div>
          <div className="text-sm text-foreground/80 space-y-1.5 pl-7">
            {formData.banReason && (
              <p>
                <strong className="text-foreground">Reason on file:</strong> {formData.banReason}
              </p>
            )}
            {formData.bannedAt && (
              <p className="text-xs text-foreground/60">
                Action timestamp: {formatDateTime(formData.bannedAt)}
              </p>
            )}
            <p className="text-xs text-foreground/70 pt-1">
              For security or clinic booking reinstatement queries, please contact clinic administration at{' '}
              <a href="mailto:concierge@auralixa.com" className="text-gold underline underline-offset-2">
                concierge@auralixa.com
              </a>.
            </p>
          </div>
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

        <div className="text-center sm:text-left space-y-2.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border ${roleBadge.bg}`}>
              {formData.role === 'admin' ? (
                <Shield className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-gold" />
              )}
              {roleBadge.text}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusBadge.bg}`}>
              {statusBadge.text}
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

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-foreground/50 pt-1">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <span>Member since {formatDate(initialProfile.created_at)}</span>
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>Updated {formatDate(lastUpdatedAt)}</span>
            </span>
          </div>

          <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[11px] text-foreground/60">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Profile photo encrypted in private Supabase cloud storage.</span>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1 text-[11px] text-foreground/70 hover:text-foreground font-mono bg-muted/50 hover:bg-muted px-2 py-0.5 rounded border border-border/60 transition-colors cursor-pointer"
              title="Click to copy full Client UUID"
            >
              <Fingerprint className="w-3 h-3 text-gold" />
              <span>ID: {initialProfile.id.slice(0, 8)}...</span>
              {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: Personal & Contact Information */}
      {/* ========================================================================= */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-gold" />
            <span>Personal Information</span>
          </h3>
          <p className="text-xs text-foreground/60 mt-1">
            Manage your personal profile details, contact numbers, and aesthetic record information.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* 1. first_name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              First Name <code className="text-[10px] text-foreground/40 font-mono font-normal">first_name</code>
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

          {/* 2. last_name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Last Name <code className="text-[10px] text-foreground/40 font-mono font-normal">last_name</code>
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

          {/* 3. email */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center gap-1.5">
              <span>Email Address</span>
              <Lock className="w-3 h-3 text-foreground/40" />
              <code className="text-[10px] text-foreground/40 font-mono font-normal">email</code>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={initialProfile.email || ''}
                className="w-full pl-10 pr-3.5 py-2.5 bg-muted/40 border border-border/60 rounded-lg text-sm text-foreground/60 cursor-not-allowed font-mono"
              />
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Email is managed by Supabase authentication and cannot be edited here.
            </span>
          </div>

          {/* 4. phone */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Phone Number <code className="text-[10px] text-foreground/40 font-mono font-normal">phone</code>
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

          {/* 5. date_of_birth */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Date of Birth <code className="text-[10px] text-foreground/40 font-mono font-normal">date_of_birth</code>
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
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Required for clinical age verification prior to aesthetic procedures.
            </span>
          </div>

          {/* 6. avatar_url */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Avatar Storage Path <code className="text-[10px] text-foreground/40 font-mono font-normal">avatar_url</code>
            </label>
            <div className="relative flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground">
              <Camera className="w-4 h-4 text-gold shrink-0" />
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="Bucket path (e.g. userId/avatar.png)"
                className="w-full bg-transparent text-xs font-mono text-foreground focus:outline-none placeholder:text-foreground/30 truncate"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-gold hover:underline font-medium shrink-0 cursor-pointer"
              >
                Upload
              </button>
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Storage key in private client-avatars bucket.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: Address Details */}
      {/* ========================================================================= */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" />
            <span>Residential & Billing Address</span>
          </h3>
          <p className="text-xs text-foreground/60 mt-1">
            Primary residential address for clinic registration, appointment invoicing, and aftercare documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* 7. address_line1 */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>Street Address (Line 1)</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">address_line1</code>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="e.g. 48 Mayfair Court, Berkeley Street"
                className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
              />
            </div>
          </div>

          {/* 8. address_line2 */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>Apartment, Suite, Unit (Line 2 - Optional)</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">address_line2</code>
            </label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="e.g. Suite 3B, Penthouse"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
          </div>

          {/* 9. city */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>City / Town</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">city</code>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. London"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
          </div>

          {/* 10. state / county */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>County / State / Region</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">state</code>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Greater London"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
          </div>

          {/* 11. postal_code */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>Postal Code / Postcode</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">postal_code</code>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="e.g. W1J 8EH"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground uppercase placeholder:normal-case placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all font-mono"
            />
          </div>

          {/* 12. country */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-gold" />
                <span>Country</span>
              </span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">country</code>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. United Kingdom"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: Clinical Care & Emergency Contact */}
      {/* ========================================================================= */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-gold" />
            <span>Emergency Contact & Clinical Preferences</span>
          </h3>
          <p className="text-xs text-foreground/60 mt-1">
            Clinical procedure safeguards, emergency contact records, and contraindication notes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* 13. emergency_contact_name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Emergency Contact Name <code className="text-[10px] text-foreground/40 font-mono font-normal">emergency_contact_name</code>
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

          {/* 14. emergency_contact_phone */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5">
              Emergency Contact Phone <code className="text-[10px] text-foreground/40 font-mono font-normal">emergency_contact_phone</code>
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

          {/* 15. medical_allergies */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Medical & Skin Allergies (Contraindications)</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">medical_allergies</code>
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
              Confidential clinical data reviewed by practitioners prior to micro-needling and facial treatments.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTIONS 4, 5, 6: Administrative Controls (Admin Accounts Only) */}
      {/* ========================================================================= */}
      {isAdmin && (
        <>
          {/* SECTION 4: Account Role & Standing Status */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-gold" />
                  <span>Account Role & Status Permissions</span>
                </h3>
                <p className="text-xs text-foreground/60 mt-1">
                  Configure permission tiers and account standing states in the database registry.
                </p>
              </div>
              <span className="text-[11px] font-medium bg-purple-500/10 text-purple-700 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                Admin Only
              </span>
            </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* 16. role */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>Account Role</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">role</code>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all cursor-pointer"
            >
              <option value="user">user (Standard Member)</option>
              <option value="client">client (Clinic Aesthetic Client)</option>
              <option value="admin">admin (Clinic Administrator)</option>
            </select>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Defines access to admin management console vs client booking dashboard.
            </span>
          </div>

          {/* 17. status */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>Account Status</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">status</code>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all cursor-pointer"
            >
              <option value="active">active (Good Standing)</option>
              <option value="suspended">suspended (Temporary Hold)</option>
              <option value="banned">banned (Clinic Restriction)</option>
              <option value="rejected">rejected (Application Declined)</option>
            </select>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Controls whether user is authorized to book appointments or access clinical facilities.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: Disciplinary & Moderation Records */}
      {/* ========================================================================= */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
            <Ban className="w-5 h-5 text-gold" />
            <span>Moderation & Disciplinary Records</span>
          </h3>
          <p className="text-xs text-foreground/60 mt-1">
            Audit trail and administrative notes for account restrictions, policy violations, or suspensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* 18. ban_reason */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>Ban / Suspension Reason</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">ban_reason</code>
            </label>
            <input
              type="text"
              name="banReason"
              value={formData.banReason}
              onChange={handleChange}
              placeholder="e.g. Repeated late cancellation without notice, contraindication hold, etc."
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
            />
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Internal rationale or explanation shown to restricted users.
            </span>
          </div>

          {/* 19. banned_at */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70">
                Banned At Timestamp <code className="text-[10px] text-foreground/40 font-mono font-normal">banned_at</code>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={handleSetBannedAtNow}
                  className="text-gold hover:underline cursor-pointer font-medium"
                >
                  Set Now
                </button>
                {formData.bannedAt && (
                  <button
                    type="button"
                    onClick={handleClearBannedAt}
                    className="text-destructive hover:underline cursor-pointer font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <Clock className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="datetime-local"
                name="bannedAt"
                value={formData.bannedAt}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
              />
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Timestamp when the suspension or ban took effect.
            </span>
          </div>

          {/* 20. banned_by */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span>Banned By (Admin UUID)</span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">banned_by</code>
            </label>
            <div className="relative">
              <Fingerprint className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="bannedBy"
                value={formData.bannedBy}
                onChange={handleChange}
                placeholder="UUID of executing administrator"
                className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground font-mono placeholder:font-sans placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
              />
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Must reference an existing administrator profile UUID or be left blank.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 6: System Identifiers & Timestamps (Read-Only) */}
      {/* ========================================================================= */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
            <FileBadge2 className="w-5 h-5 text-gold" />
            <span>System Identifiers & Registry Timestamps</span>
          </h3>
          <p className="text-xs text-foreground/60 mt-1">
            System-generated audit keys and immutable database creation records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* 21. id */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-foreground/40" />
                <span>Profile ID (UUID)</span>
              </span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">id</code>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                disabled
                value={initialProfile.id}
                className="w-full pl-3.5 pr-10 py-2.5 bg-muted/40 border border-border/60 rounded-lg text-xs font-mono text-foreground/70 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleCopyId}
                className="absolute right-2.5 p-1 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                title="Copy full UUID"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Primary Key & foreign key to auth.users.
            </span>
          </div>

          {/* 22. created_at */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-foreground/40" />
                <span>Created At</span>
              </span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">created_at</code>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                value={formatDateTime(initialProfile.created_at)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-muted/40 border border-border/60 rounded-lg text-xs font-mono text-foreground/70 cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              UTC account registration timestamp.
            </span>
          </div>

          {/* 23. updated_at */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-foreground/70 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-foreground/40" />
                <span>Last Updated At</span>
              </span>
              <code className="text-[10px] text-foreground/40 font-mono font-normal">updated_at</code>
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                value={formatDateTime(lastUpdatedAt)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-muted/40 border border-border/60 rounded-lg text-xs font-mono text-foreground/70 cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-foreground/50 mt-1 block">
              Auto-refreshed whenever any profile field is saved.
            </span>
          </div>
        </div>
      </div>
    </>
  )}

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-9 rounded-xl font-medium shadow-sm transition-all text-sm cursor-pointer"
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
