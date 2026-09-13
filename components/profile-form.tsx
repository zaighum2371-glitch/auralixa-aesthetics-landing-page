'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  Camera
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

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Display / Preview */}
        <div className="relative group shrink-0">
          {formData.avatarUrl ? (
            <img
              src={formData.avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gold/40 shadow-sm"
              onError={(e) => {
                // Fallback to placeholder if URL fails
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground font-serif text-2xl font-medium flex items-center justify-center border-2 border-gold/40 shadow-sm">
              {initials}
            </div>
          )}
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
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
              Profile Photo URL
            </label>
            <div className="relative">
              <Camera className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all"
              />
            </div>
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
