'use client'

import React from 'react'
import Link from 'next/link'
import {
  Calendar,
  Users,
  Layers,
  PoundSterling,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  CreditCard,
  UserPlus,
  CalendarPlus,
  Shield,
  ShieldAlert,
} from 'lucide-react'
import { useAdminStore } from './admin-store-provider'
import { RoleManager } from './role-manager'

interface AdminOverviewProps {
  userList: any[]
  signedUrlMap: Record<string, string>
  updateUserRole: (userId: string, newRole: 'user' | 'client' | 'admin') => Promise<void>
}

export function AdminOverview({ userList, signedUrlMap, updateUserRole }: AdminOverviewProps) {
  const { categories, sessions, clients, bookings, isHydrated } = useAdminStore()

  // Dynamic metrics from mock store
  const totalSessions = sessions.length
  const activeSessions = sessions.filter((s) => s.status === 'active').length
  const totalCategories = categories.length
  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.status === 'active').length

  const pendingBookings = bookings.filter((b) => b.status === 'pending')
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed')
  const completedBookings = bookings.filter((b) => b.status === 'completed')

  const totalInPersonRevenue = bookings
    .filter((b) => b.payment_status === 'paid_in_person')
    .reduce((sum, b) => sum + b.total_price, 0)

  const pendingInPersonSettlement = bookings
    .filter((b) => b.payment_status === 'pending_in_person' && b.status !== 'cancelled_by_admin' && b.status !== 'cancelled_by_client')
    .reduce((sum, b) => sum + b.total_price, 0)

  // Recent 4 bookings for agenda preview
  const recentBookings = [...bookings]
    .sort((a, b) => (a.appointment_date < b.appointment_date ? 1 : -1))
    .slice(0, 4)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">
              Clinic Administration & Operations
            </span>
            <span className="text-foreground/40 text-xs">&bull;</span>
            <span className="text-xs text-foreground/60 font-medium">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mt-1 tracking-tight">
            Clinic Overview
          </h1>
          <p className="text-sm text-foreground/70 mt-1 max-w-2xl">
            Central administrative console for Harley Street operations. Manage appointment schedules, treatment offerings, clinical intake records, and front desk payment settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/admin/bookings?action=new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 shadow-sm transition-all"
          >
            <CalendarPlus className="w-4 h-4 text-gold" />
            <span>New Booking</span>
          </Link>
          <Link
            href="/admin/sessions?action=new-treatment"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted/40 text-sm font-medium text-foreground transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            <span>Add Session</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards Below Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bookings Summary */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3 hover:border-gold/60 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Appointments
            </span>
            <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif font-medium text-foreground">
              {bookings.length}
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/60 mt-1">
              <span className="text-emerald-700 font-medium">
                {confirmedBookings.length} confirmed
              </span>
              <span>&bull;</span>
              <span className="text-amber-700 font-medium">
                {pendingBookings.length} pending
              </span>
            </div>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1 pt-1 group-hover:underline"
          >
            <span>View booking ledger</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Sessions & Catalog */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3 hover:border-gold/60 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Treatments Catalog
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif font-medium text-foreground">
              {totalSessions}
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/60 mt-1">
              <span className="text-emerald-700 font-medium">{activeSessions} active</span>
              <span>&bull;</span>
              <span>{totalCategories} categories</span>
            </div>
          </div>
          <Link
            href="/admin/sessions"
            className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1 pt-1 group-hover:underline"
          >
            <span>Manage sessions & types</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Registered Clients */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3 hover:border-gold/60 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Clients Registry
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif font-medium text-foreground">
              {totalClients}
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/60 mt-1">
              <span className="text-emerald-700 font-medium">{activeClients} active accounts</span>
              <span>&bull;</span>
              <span>Harley St cohort</span>
            </div>
          </div>
          <Link
            href="/admin/clients"
            className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1 pt-1 group-hover:underline"
          >
            <span>Open client directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Desk Revenue */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3 hover:border-gold/60 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              In-Person Desk Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-gold/15 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
              <PoundSterling className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif font-medium text-foreground">
              £{totalInPersonRevenue.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/60 mt-1">
              <span className="text-amber-700 font-medium">
                £{pendingInPersonSettlement.toFixed(2)} pending settlement
              </span>
            </div>
          </div>
          <Link
            href="/admin/bookings?filter=pending-payment"
            className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1 pt-1 group-hover:underline"
          >
            <span>View payment desk</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Dedicated Quicklinks / Quick Actions Bar */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-medium text-foreground">
              Operational Quick Actions
            </h2>
            <p className="text-xs text-foreground/60">
              High-frequency administrative workflows for reception and clinic managers.
            </p>
          </div>
          <span className="text-[11px] font-medium text-foreground/40 hidden sm:inline">
            Auralixa Fast Actions
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/bookings?action=new"
            className="p-4 rounded-xl border border-border/70 hover:border-gold hover:bg-muted/30 transition-all flex flex-col items-start gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-gold/15 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground block group-hover:text-gold transition-colors">
                New Booking
              </span>
              <span className="text-[11px] text-foreground/50 leading-tight block mt-0.5">
                Schedule patient slot
              </span>
            </div>
          </Link>

          <Link
            href="/admin/sessions?action=new-treatment"
            className="p-4 rounded-xl border border-border/70 hover:border-gold hover:bg-muted/30 transition-all flex flex-col items-start gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground block group-hover:text-gold transition-colors">
                Add Treatment
              </span>
              <span className="text-[11px] text-foreground/50 leading-tight block mt-0.5">
                New clinical offering
              </span>
            </div>
          </Link>

          <Link
            href="/admin/sessions?tab=categories&action=new-category"
            className="p-4 rounded-xl border border-border/70 hover:border-gold hover:bg-muted/30 transition-all flex flex-col items-start gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4 text-foreground/70" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground block group-hover:text-gold transition-colors">
                New Category
              </span>
              <span className="text-[11px] text-foreground/50 leading-tight block mt-0.5">
                Treatment taxonomy
              </span>
            </div>
          </Link>

          <Link
            href="/admin/clients?action=new"
            className="p-4 rounded-xl border border-border/70 hover:border-gold hover:bg-muted/30 transition-all flex flex-col items-start gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground block group-hover:text-gold transition-colors">
                Register Client
              </span>
              <span className="text-[11px] text-foreground/50 leading-tight block mt-0.5">
                Add medical profile
              </span>
            </div>
          </Link>

          <Link
            href="/admin/bookings?filter=pending-payment"
            className="p-4 rounded-xl border border-border/70 hover:border-gold hover:bg-muted/30 transition-all flex flex-col items-start gap-2 text-left group col-span-2 sm:col-span-1"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground block group-hover:text-gold transition-colors">
                Desk Payment
              </span>
              <span className="text-[11px] text-foreground/50 leading-tight block mt-0.5">
                Collect in-person dues
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Two Columns: Agenda & Category Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Bookings & Agenda */}
        <div className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="font-serif text-lg font-medium text-foreground">
                Upcoming Clinic Agenda
              </h2>
              <p className="text-xs text-foreground/60">
                Scheduled consultations and treatment appointments at Harley Street.
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1"
            >
              <span>View all ({bookings.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-8 text-center text-sm text-foreground/50">
              No appointments scheduled currently.
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">
                          {b.client_name}
                        </span>
                        <span className="text-xs font-mono text-foreground/50">
                          {b.booking_reference}
                        </span>
                      </div>
                      <div className="text-xs text-foreground/70 mt-0.5">
                        {b.session_title} &bull;{' '}
                        <span className="text-gold font-medium">£{b.total_price.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] text-foreground/50 mt-1">
                        {b.appointment_date} &bull; {b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full border ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                          : b.status === 'completed'
                          ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                          : b.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                          : 'bg-red-500/10 text-red-700 border-red-500/20'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                    <Link
                      href="/admin/bookings"
                      className="px-2.5 py-1 rounded-lg border border-border/80 text-xs font-medium text-foreground hover:bg-muted/50"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Categories Distribution */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="font-serif text-lg font-medium text-foreground">
                Treatment Categories
              </h2>
              <p className="text-xs text-foreground/60">
                {categories.length} registered clinical categories.
              </p>
            </div>
            <Link
              href="/admin/sessions?tab=categories"
              className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {categories.map((cat) => {
              const sessionCount = sessions.filter(
                (s) => s.session_type_id === cat.id || s.category_name === cat.name
              ).length

              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-xl border border-border/60 flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <div>
                    <span className="text-xs font-medium text-foreground block">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-foreground/50">
                      Standard duration: {cat.default_duration_minutes}m (+{cat.buffer_minutes}m buffer)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-muted text-foreground/70">
                      {sessionCount} treatments
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/admin/sessions?tab=categories&action=new-category"
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-border/90 hover:border-gold text-xs font-medium text-foreground/70 hover:text-foreground flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-gold" />
              <span>Create New Category</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Role Management & User Directory Table (Maintained from Phase 1) */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-foreground">
              User Profiles & Role Rules Testing
            </h2>
            <p className="text-xs text-foreground/60">
              Live records from the Supabase <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">public.profiles</code> table. You can modify any user&apos;s role below to test role switching.
            </p>
          </div>
          <span className="text-xs font-medium text-foreground/50 self-start sm:self-auto">
            {userList.length} Registered Live Profiles
          </span>
        </div>

        {userList.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ShieldAlert className="w-8 h-8 text-foreground/30 mx-auto" />
            <p className="text-sm text-foreground/70">
              No profiles found in the database yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                  <th className="py-3 px-3">Name / User</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Current Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Role Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {userList.map((userProfile) => {
                  const initials = [userProfile.first_name?.[0], userProfile.last_name?.[0]]
                    .filter(Boolean)
                    .join('')
                    .toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'

                  const avatarSrc = signedUrlMap[userProfile.avatar_url] || userProfile.avatar_url

                  return (
                    <tr key={userProfile.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={userProfile.first_name || 'User'}
                              className="w-8 h-8 rounded-full object-cover border border-gold/40 shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-border/80 font-serif text-xs font-medium flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-foreground text-xs sm:text-sm">
                              {userProfile.first_name || userProfile.last_name
                                ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                                : 'Unnamed User'}
                            </div>
                            <div className="text-[11px] text-foreground/50 truncate">
                              ID: {userProfile.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-foreground/80 font-mono text-xs">
                        {userProfile.email}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            userProfile.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-700 border-purple-500/20'
                              : userProfile.role === 'client'
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                          }`}
                        >
                          {userProfile.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                          {userProfile.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <RoleManager
                          userId={userProfile.id}
                          currentRole={userProfile.role}
                          onUpdateRole={updateUserRole}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
