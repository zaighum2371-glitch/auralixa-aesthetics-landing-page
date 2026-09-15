'use client'

import React, { useState, useMemo } from 'react'
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
  TrendingUp,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  User,
  FileText,
} from 'lucide-react'
import { useAdminStore } from './admin-store-provider'
import { RoleManager } from './role-manager'
import { MockCategory, MockSession, MockClient, MockBooking } from '@/lib/admin-mock-data'
import { settleInPersonPayment } from '@/actions/admin-bookings'

interface AdminOverviewProps {
  userList: any[]
  signedUrlMap: Record<string, string>
  updateUserRole: (userId: string, newRole: 'user' | 'client' | 'admin') => Promise<void>
  liveData?: {
    categories?: MockCategory[]
    sessions?: MockSession[]
    clients?: MockClient[]
    bookings?: MockBooking[]
  }
  currentUserId?: string
}

type DateRange = 'today' | '7d' | 'month' | 'quarter'
type ContextualFocus = 'all' | 'unsettled' | 'today_agenda' | 'intake_alerts'

export function AdminOverview({
  userList,
  signedUrlMap,
  updateUserRole,
  liveData,
  currentUserId,
}: AdminOverviewProps) {
  const {
    categories: storeCategories,
    sessions: storeSessions,
    clients: storeClients,
    bookings: storeBookings,
    recordDeskPayment,
  } = useAdminStore()

  const categories = liveData?.categories && liveData.categories.length > 0 ? liveData.categories : storeCategories
  const sessions = liveData?.sessions && liveData.sessions.length > 0 ? liveData.sessions : storeSessions
  const clients = liveData?.clients && liveData.clients.length > 0 ? liveData.clients : storeClients
  const bookings = liveData?.bookings && liveData.bookings.length > 0 ? liveData.bookings : storeBookings

  // Date Range Filter State
  const [dateRange, setDateRange] = useState<DateRange>('month')
  // Contextual Quick Action Focus
  const [contextFocus, setContextFocus] = useState<ContextualFocus>('all')
  // User Directory Role Filter State
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'client' | 'user'>('all')

  // Role Counts for Quick Filter Pills
  const roleCounts = {
    all: userList.length,
    admin: userList.filter((u) => u.role === 'admin').length,
    client: userList.filter((u) => u.role === 'client').length,
    user: userList.filter((u) => u.role === 'user').length,
  }

  const filteredUserList = userList.filter((u) => {
    if (userRoleFilter === 'all') return true
    return u.role === userRoleFilter
  })

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
    .filter(
      (b) =>
        b.payment_status === 'pending_in_person' &&
        b.status !== 'cancelled_by_admin' &&
        b.status !== 'cancelled_by_client'
    )
    .reduce((sum, b) => sum + b.total_price, 0)

  // Dynamic trend calculations based on dateRange
  const isWithinRange = (dateStr: string | undefined) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const now = new Date()
    if (dateRange === 'today') {
      return d.toISOString().split('T')[0] === now.toISOString().split('T')[0]
    } else if (dateRange === '7d') {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return d >= past && d <= now
    } else if (dateRange === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    } else if (dateRange === 'quarter') {
      const q = Math.floor(now.getMonth() / 3)
      const dq = Math.floor(d.getMonth() / 3)
      return q === dq && d.getFullYear() === now.getFullYear()
    }
    return true
  }

  const rangeBookings = bookings.filter(b => isWithinRange(b.appointment_date))
  const rangeRevenue = rangeBookings.filter(b => b.payment_status === 'paid_in_person').reduce((sum, b) => sum + b.total_price, 0)
  const rangeClients = clients.filter(c => isWithinRange(c.created_at))

  const rangeLabels: Record<string, string> = {
    today: 'Today',
    '7d': 'Past 7 Days',
    month: 'This Month',
    quarter: 'This Quarter'
  }
  const label = rangeLabels[dateRange] || 'This Month'

  // Determine top treatment
  const sessionCounts: Record<string, number> = {}
  bookings.forEach(b => {
    if (b.session_title) {
      sessionCounts[b.session_title] = (sessionCounts[b.session_title] || 0) + 1
    }
  })
  let topSessionTitle = 'None yet'
  let maxCount = 0
  for (const [title, count] of Object.entries(sessionCounts)) {
    if (count > maxCount) {
      maxCount = count
      topSessionTitle = title
    }
  }

  const trends = {
    appointments: `${rangeBookings.length} scheduled`,
    appointmentsPct: label,
    revenue: `£${rangeRevenue.toFixed(0)} collected`,
    revenuePct: label,
    clients: `${rangeClients.length} new registrations`,
    clientsPct: label,
    catalog: `${activeSessions} active treatments`,
  }

  // Contextual Agenda Filter
  const filteredAgenda = bookings.filter((b) => {
    if (contextFocus === 'unsettled') {
      return b.payment_status === 'pending_in_person' && b.status !== 'cancelled_by_admin'
    }
    if (contextFocus === 'today_agenda') {
      return b.status === 'confirmed' || b.status === 'pending'
    }
    return true
  }).slice(0, 5)

  // Activities logic
  const activities = useMemo(() => {
    const list: any[] = []
    
    // User Activity - Bookings
    bookings.forEach(b => {
      list.push({
        id: `book-${b.id}`,
        type: 'user',
        action: 'New Appointment',
        description: `${b.client_name} booked ${b.session_title}`,
        date: new Date(b.appointment_date).toISOString(),
      })
    })

    // User Activity - Clients
    clients.forEach(c => {
      list.push({
        id: `client-${c.id}`,
        type: 'user',
        action: 'Client Registration',
        description: `${c.first_name} ${c.last_name} registered an account`,
        date: c.created_at,
      })
    })

    // Admin Activity - Admin user role changes or categories
    categories.forEach((cat, idx) => {
      const d = new Date()
      d.setDate(d.getDate() - idx)
      list.push({
        id: `cat-${cat.id}`,
        type: 'admin',
        action: 'Catalog Update',
        description: `Category "${cat.name}" was modified`,
        date: d.toISOString()
      })
    })
    
    sessions.forEach((s, idx) => {
      if (idx > 3) return; // limit
      const d = new Date()
      d.setHours(d.getHours() - (idx * 5))
      list.push({
        id: `sess-${s.id}`,
        type: 'admin',
        action: 'Treatment Added',
        description: `Admin added new treatment: ${s.title}`,
        date: d.toISOString()
      })
    })

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [bookings, clients, categories, sessions])

  const [activityFilter, setActivityFilter] = useState<'all' | 'user' | 'admin'>('all')
  const filteredActivities = activities.filter(a => activityFilter === 'all' || a.type === activityFilter)

  // Clients with allergy alerts
  const allergyAlertClients = clients.filter(
    (c) =>
      c.medical_allergies &&
      c.medical_allergies.toLowerCase() !== 'none' &&
      c.medical_allergies.toLowerCase() !== 'none recorded'
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Date Range Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">
              Clinic Administration & Operations
            </span>
            <span className="text-foreground/40 text-xs">&bull;</span>
            <span suppressHydrationWarning className="text-xs text-foreground/60 font-medium">
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
            Central administrative console for Harley Street operations. Monitor real-time performance trends, manage schedules, and process front-desk settlements.
          </p>
        </div>

        {/* Date Range Selector Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/70 text-xs">
            <Filter className="w-3 h-3 text-foreground/40 ml-1.5 hidden sm:block" />
            {(
              [
                { id: 'today', label: 'Today' },
                { id: '7d', label: 'Last 7 Days' },
                { id: 'month', label: 'This Month' },
                { id: 'quarter', label: 'Quarter' },
              ] as const
            ).map((rng) => (
              <button
                key={rng.id}
                onClick={() => setDateRange(rng.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  dateRange === rng.id
                    ? 'bg-card text-foreground font-semibold shadow-xs border border-border/80'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {rng.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/bookings?action=new"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 shadow-sm transition-all"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-gold" />
              <span>New Booking</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards with Trend Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bookings Summary with Trend */}
        <div 
          className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3 hover:border-gold/60 transition-all group"
          title="Total scheduled appointments, broken down by confirmed and pending status."
        >
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

          {/* Trend Indicator Pill */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              <span>{trends.appointmentsPct}</span>
            </span>
            <span className="text-foreground/40 font-mono text-[10px]">
              {trends.appointments}
            </span>
          </div>

          <Link
            href="/admin/bookings"
            className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1 pt-0.5 group-hover:underline"
          >
            <span>View booking ledger</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Sessions & Catalog with Trend */}
        <div 
          className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3 hover:border-gold/60 transition-all group"
          title="Total registered treatments in your catalog. 'Active' means the treatment is currently available for booking."
        >
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

          {/* Trend Indicator Pill */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
            <span className="inline-flex items-center gap-1 text-gold bg-gold/10 px-2 py-0.5 rounded-full font-medium border border-gold/20">
              <Sparkles className="w-3 h-3" />
              <span>Top: {topSessionTitle}</span>
            </span>
            <span className="text-foreground/40 font-mono text-[10px]">
              {trends.catalog}
            </span>
          </div>

          <Link
            href="/admin/sessions"
            className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1 pt-0.5 group-hover:underline"
          >
            <span>Manage sessions & types</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Registered Clients with Trend */}
        <div 
          className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3 hover:border-gold/60 transition-all group"
          title="Total number of registered clients. Active accounts have full access to the portal."
        >
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

          {/* Trend Indicator Pill */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              <span>{trends.clientsPct}</span>
            </span>
            <span className="text-foreground/40 font-mono text-[10px]">
              {trends.clients}
            </span>
          </div>

          <Link
            href="/admin/clients"
            className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1 pt-0.5 group-hover:underline"
          >
            <span>Open client directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* In-Person Desk Revenue with Trend */}
        <div 
          className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3 hover:border-gold/60 transition-all group"
          title="Total revenue from appointments that have been paid in person. Pending settlement shows amounts yet to be collected at the desk."
        >
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

          {/* Trend Indicator Pill */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              <span>{trends.revenuePct}</span>
            </span>
            <span className="text-foreground/40 font-mono text-[10px]">
              {trends.revenue}
            </span>
          </div>

          <Link
            href="/admin/bookings?filter=pending-payment"
            className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1 pt-0.5 group-hover:underline"
          >
            <span>View payment desk</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Contextual Quick Actions Bar */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold" />
              <h2 className="font-serif text-lg font-medium text-foreground">
                Contextual Quick Actions
              </h2>
            </div>
            <p className="text-xs text-foreground/60 mt-0.5">
              Instant operations and filtered operational views for front desk triage.
            </p>
          </div>

          {/* Contextual Focus Tabs */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/70 text-xs">
            <button
              onClick={() => setContextFocus('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                contextFocus === 'all'
                  ? 'bg-card text-foreground font-semibold shadow-xs border border-border/80'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              All Operations
            </button>
            <button
              onClick={() => setContextFocus('unsettled')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                contextFocus === 'unsettled'
                  ? 'bg-amber-500/15 text-amber-900 font-semibold shadow-xs border border-amber-500/30'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Unsettled Dues (£{pendingInPersonSettlement.toFixed(0)})
            </button>
            <button
              onClick={() => setContextFocus('intake_alerts')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                contextFocus === 'intake_alerts'
                  ? 'bg-red-500/15 text-red-900 font-semibold shadow-xs border border-red-500/30'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Allergy Alerts ({allergyAlertClients.length})
            </button>
          </div>
        </div>

        {/* 5 Quick Action Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
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
                Schedule slot
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
                New offering
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
                Taxonomy
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
                Add patient
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
                Collect dues
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Two Columns: Agenda & Category Overview (Dynamically adjusted by context focus) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Contextual Bookings & Agenda */}
        <div className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="font-serif text-lg font-medium text-foreground">
                {contextFocus === 'unsettled'
                  ? 'Unsettled Desk Dues (Action Required)'
                  : 'Upcoming Clinic Agenda'}
              </h2>
              <p className="text-xs text-foreground/60">
                {contextFocus === 'unsettled'
                  ? 'Appointments awaiting in-person card terminal or cash settlement.'
                  : 'Scheduled consultations and treatment appointments at Harley Street.'}
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

          {filteredAgenda.length === 0 ? (
            <div className="py-8 text-center text-sm text-foreground/50">
              No appointments matching this focus filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAgenda.map((b) => (
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
                        <span className="text-gold font-semibold">£{b.total_price.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] text-foreground/50 mt-1">
                        {b.appointment_date} &bull; {b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {b.payment_status === 'pending_in_person' && (
                      <button
                        onClick={async () => {
                          recordDeskPayment(b.id, 'Chip & PIN Terminal - Front Desk')
                          await settleInPersonPayment(b.id, 'Chip & PIN Terminal - Front Desk')
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
                        title="One-click settle dues"
                      >
                        <CreditCard className="w-3 h-3 text-amber-700" />
                        <span>Settle £{b.total_price.toFixed(0)}</span>
                      </button>
                    )}

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

        {/* Right 1 Col: Category Distribution or Allergy Triage */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
          {contextFocus === 'intake_alerts' ? (
            <>
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="font-serif text-lg font-medium text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Intake Allergies</span>
                  </h2>
                  <p className="text-xs text-foreground/60">
                    {allergyAlertClients.length} clients requiring clinician review.
                  </p>
                </div>
                <Link
                  href="/admin/clients"
                  className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1"
                >
                  <span>Directory</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {allergyAlertClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-foreground">
                      <span>{client.first_name} {client.last_name}</span>
                      <span className="text-[10px] text-foreground/50">{client.city}</span>
                    </div>
                    <div className="text-xs text-amber-800 font-medium">
                      ⚠️ {client.medical_allergies}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="font-serif text-lg font-medium text-foreground">
                    Recent Activity
                  </h2>
                  <p className="text-xs text-foreground/60">
                    Latest system events and operations.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/60">
                  <button
                    onClick={() => setActivityFilter('all')}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                      activityFilter === 'all' ? 'bg-card shadow-xs text-foreground' : 'text-foreground/50 hover:text-foreground'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActivityFilter('user')}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                      activityFilter === 'user' ? 'bg-card shadow-xs text-foreground' : 'text-foreground/50 hover:text-foreground'
                    }`}
                  >
                    User
                  </button>
                  <button
                    onClick={() => setActivityFilter('admin')}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                      activityFilter === 'admin' ? 'bg-card shadow-xs text-foreground' : 'text-foreground/50 hover:text-foreground'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredActivities.length === 0 ? (
                  <div className="text-center text-xs text-foreground/50 py-4">No recent activity.</div>
                ) : (
                  filteredActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 p-2.5 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        act.type === 'admin' ? 'bg-purple-500/10 text-purple-600' : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {act.type === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-foreground truncate">{act.action}</span>
                          <span className="text-[10px] text-foreground/40 shrink-0">
                            {new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/60 leading-snug mt-0.5">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
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
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-medium text-foreground/50">
              {filteredUserList.length} of {userList.length} Profiles
            </span>
          </div>
        </div>

        {/* Quick Role Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-gold" />
            <span>Role Filter:</span>
          </span>
          <button
            onClick={() => setUserRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              userRoleFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'bg-muted/50 hover:bg-muted text-foreground/70'
            }`}
          >
            All Roles ({roleCounts.all})
          </button>
          <button
            onClick={() => setUserRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              userRoleFilter === 'admin'
                ? 'bg-purple-600 text-white shadow-xs font-semibold'
                : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 border border-purple-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admins ({roleCounts.admin})</span>
          </button>
          <button
            onClick={() => setUserRoleFilter('client')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              userRoleFilter === 'client'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/20'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Clients ({roleCounts.client})</span>
          </button>
          <button
            onClick={() => setUserRoleFilter('user')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              userRoleFilter === 'user'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/20'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Members ({roleCounts.user})</span>
          </button>
        </div>

        {userList.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ShieldAlert className="w-8 h-8 text-foreground/30 mx-auto" />
            <p className="text-sm text-foreground/70">
              No profiles found in the database yet.
            </p>
          </div>
        ) : filteredUserList.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-muted/20 rounded-xl border border-dashed border-border/80">
            <ShieldAlert className="w-7 h-7 text-foreground/30 mx-auto" />
            <p className="text-sm text-foreground/70">
              No profiles match the role filter &ldquo;{userRoleFilter}&rdquo;.
            </p>
            <button
              onClick={() => setUserRoleFilter('all')}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-gold hover:text-foreground transition-colors shadow-2xs"
            >
              Clear Role Filter
            </button>
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
                  <th className="py-3 px-3 text-right sticky right-0 bg-card z-10 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.06)]">Action & Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredUserList.map((userProfile) => {
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
                              className="w-9 h-9 rounded-full object-cover border border-gold/40 shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-border/80 font-serif text-xs font-medium flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-foreground text-xs sm:text-sm flex items-center gap-2">
                              {userProfile.first_name || userProfile.last_name
                                ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                                : 'Unnamed User'}
                              {userProfile.id === currentUserId && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold bg-gold/20 text-gold border border-gold/30">
                                  You
                                </span>
                              )}
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
                      <td className="py-3 px-3 text-right sticky right-0 bg-card/95 backdrop-blur-xs z-10 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.06)] whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <RoleManager
                            userId={userProfile.id}
                            currentRole={userProfile.role}
                            onUpdateRole={updateUserRole}
                            disabled={userProfile.id === currentUserId}
                          />
                          <Link
                            href={`/admin/clients?q=${encodeURIComponent(userProfile.email || '')}`}
                            className="p-1.5 rounded-lg border border-border/80 bg-background text-foreground/70 hover:text-gold hover:border-gold transition-colors inline-flex items-center justify-center shadow-2xs"
                            title="View in Client Directory"
                          >
                            <FileText className="w-3.5 h-3.5 text-gold" />
                          </Link>
                        </div>
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
