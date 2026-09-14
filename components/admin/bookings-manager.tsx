'use client'

import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Calendar,
  Search,
  PlusCircle,
  CreditCard,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Filter,
  Edit2,
  Trash2,
  X,
  Sparkles,
  MapPin,
  PoundSterling,
  FileText,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { useAdminStore } from './admin-store-provider'
import { MockBooking } from '@/lib/admin-mock-data'
import {
  createAdminBooking,
  updateBookingStatus as serverUpdateBookingStatus,
  settleInPersonPayment as serverSettleInPersonPayment,
  updateBookingDetails as serverUpdateBookingDetails,
  deleteBooking as serverDeleteBooking,
} from '@/actions/admin-bookings'

interface BookingsManagerProps {
  initialBookings?: any[]
  liveClients?: any[]
  liveSessions?: any[]
}

export function BookingsManager({
  initialBookings,
  liveClients,
  liveSessions,
}: BookingsManagerProps = {}) {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('filter')
  const initialAction = searchParams.get('action')

  const {
    bookings: storeBookings,
    clients: storeClients,
    sessions: storeSessions,
    addBooking,
    updateBooking,
    deleteBooking,
    recordDeskPayment,
  } = useAdminStore()

  const bookings = initialBookings && initialBookings.length > 0 ? initialBookings : storeBookings
  const clients = liveClients && liveClients.length > 0 ? liveClients : storeClients
  const sessions = liveSessions && liveSessions.length > 0 ? liveSessions : storeSessions

  // Tab / Filter state
  const [statusTab, setStatusTab] = useState<string>(
    initialFilter === 'pending-payment' ? 'all' : 'all'
  )
  const [paymentFilter, setPaymentFilter] = useState<string>(
    initialFilter === 'pending-payment' ? 'pending_in_person' : 'all'
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(initialAction === 'new')
  const [editingBooking, setEditingBooking] = useState<MockBooking | null>(null)
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<MockBooking | null>(null)
  const [paymentModalBooking, setPaymentModalBooking] = useState<MockBooking | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'chip_pin' | 'cash' | 'voucher'>('chip_pin')
  const [paymentNote, setPaymentNote] = useState('Chip & PIN Terminal - Front Desk')
  const [cancellingBooking, setCancellingBooking] = useState<MockBooking | null>(null)
  const [cancelReason, setCancelReason] = useState('Client requested rescheduling')
  const [deletingBooking, setDeletingBooking] = useState<MockBooking | null>(null)

  const handleConfirmDelete = async () => {
    if (!deletingBooking) return
    deleteBooking(deletingBooking.id)
    await serverDeleteBooking(deletingBooking.id)
    if (selectedBookingDetails?.id === deletingBooking.id) {
      setSelectedBookingDetails(null)
    }
    setDeletingBooking(null)
  }

  // New Booking Form State
  const [bookingForm, setBookingForm] = useState({
    client_id: clients[0]?.id || '',
    session_id: sessions[0]?.id || '',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '11:00',
    status: 'confirmed' as MockBooking['status'],
    payment_status: 'pending_in_person' as MockBooking['payment_status'],
    client_notes: '',
    admin_notes: '',
  })

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.booking_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.session_title.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesStatus = true
      if (statusTab === 'pending') matchesStatus = b.status === 'pending'
      else if (statusTab === 'confirmed') matchesStatus = b.status === 'confirmed'
      else if (statusTab === 'completed') matchesStatus = b.status === 'completed'
      else if (statusTab === 'cancelled')
        matchesStatus =
          b.status === 'cancelled_by_client' ||
          b.status === 'cancelled_by_admin' ||
          b.status === 'no_show'

      let matchesPayment = true
      if (paymentFilter === 'pending_in_person')
        matchesPayment = b.payment_status === 'pending_in_person'
      else if (paymentFilter === 'paid_in_person')
        matchesPayment = b.payment_status === 'paid_in_person'

      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [bookings, searchQuery, statusTab, paymentFilter])

  // Open New Booking Modal
  const handleOpenNew = () => {
    setEditingBooking(null)
    setBookingForm({
      client_id: clients[0]?.id || '',
      session_id: sessions[0]?.id || '',
      appointment_date: new Date().toISOString().split('T')[0],
      start_time: '11:00',
      status: 'confirmed',
      payment_status: 'pending_in_person',
      client_notes: '',
      admin_notes: '',
    })
    setIsNewBookingOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (b: MockBooking) => {
    setEditingBooking(b)
    setBookingForm({
      client_id: b.client_id,
      session_id: b.session_id,
      appointment_date: b.appointment_date,
      start_time: b.start_time.slice(0, 5),
      status: b.status,
      payment_status: b.payment_status,
      client_notes: b.client_notes || '',
      admin_notes: b.admin_notes || '',
    })
    setIsNewBookingOpen(true)
  }

  // Save Booking (Create or Edit)
  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedClient = clients.find((c) => c.id === bookingForm.client_id)
    const selectedSession = sessions.find((s) => s.id === bookingForm.session_id)

    if (!selectedSession) return

    // Calculate end time
    const [hours, minutes] = bookingForm.start_time.split(':').map(Number)
    const durationMins = selectedSession.duration_minutes
    const endDate = new Date()
    endDate.setHours(hours, minutes + durationMins, 0)
    const endTimeStr = endDate.toTimeString().slice(0, 8)

    const payload = {
      client_id: bookingForm.client_id,
      client_name: selectedClient
        ? `${selectedClient.first_name} ${selectedClient.last_name}`
        : 'Registered Guest',
      client_email: selectedClient?.email || 'guest@auralixa.com',
      client_phone: selectedClient?.phone || '+44 7700 900000',
      session_id: selectedSession.id,
      session_title: selectedSession.title,
      category_name: selectedSession.category_name,
      appointment_date: bookingForm.appointment_date,
      start_time: `${bookingForm.start_time}:00`,
      end_time: endTimeStr,
      total_price: selectedSession.pricing,
      status: bookingForm.status,
      payment_status: bookingForm.payment_status,
      payment_method_note: editingBooking ? editingBooking.payment_method_note : null,
      client_notes: bookingForm.client_notes || null,
      admin_notes: bookingForm.admin_notes || null,
      cancel_reason: null,
    }

    if (editingBooking) {
      updateBooking(editingBooking.id, payload)
      // Call Supabase Server Action
      await serverUpdateBookingDetails(editingBooking.id, {
        appointment_date: payload.appointment_date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        total_price: payload.total_price,
        client_notes: payload.client_notes,
        admin_notes: payload.admin_notes,
      })
    } else {
      addBooking(payload)
      // Call Supabase Server Action
      await createAdminBooking({
        client_id: payload.client_id,
        session_id: payload.session_id,
        appointment_date: payload.appointment_date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        total_price: payload.total_price,
        status: payload.status,
        payment_status: payload.payment_status,
        client_notes: payload.client_notes || undefined,
        admin_notes: payload.admin_notes || undefined,
      })
    }

    setIsNewBookingOpen(false)
  }

  // Desk Payment Settlement
  const handleConfirmPayment = async () => {
    if (!paymentModalBooking) return
    const methodNote =
      paymentMethod === 'chip_pin'
        ? paymentNote || 'Chip & PIN Terminal - Front Desk'
        : paymentMethod === 'cash'
        ? `Cash Settlement (£${paymentModalBooking.total_price.toFixed(2)})`
        : 'Harley St Gift Voucher / Account Credit'

    recordDeskPayment(paymentModalBooking.id, methodNote)
    // Call Supabase Server Action
    await serverSettleInPersonPayment(paymentModalBooking.id, methodNote)
    setPaymentModalBooking(null)
  }

  // Cancel Booking
  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return
    updateBooking(cancellingBooking.id, {
      status: 'cancelled_by_admin',
      cancel_reason: cancelReason,
    })
    // Call Supabase Server Action
    await serverUpdateBookingStatus(cancellingBooking.id, 'cancelled_by_admin', cancelReason)
    setCancellingBooking(null)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">
              Clinic Operations
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground mt-1">
            Appointments & Bookings Ledger
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            Oversee Harley Street consultations, manage status transitions, and process in-person desk payments.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-gold" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Contextual Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-muted/20 p-2.5 rounded-xl border border-border/50">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider mr-1">
            Contextual Triage:
          </span>
          <button
            onClick={() => {
              setStatusTab('all')
              setPaymentFilter('all')
              setSearchQuery('')
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusTab === 'all' && paymentFilter === 'all' && !searchQuery
                ? 'bg-card text-foreground font-semibold shadow-2xs border border-border/70'
                : 'bg-muted/60 hover:bg-muted text-foreground/70'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => {
              setStatusTab('all')
              setPaymentFilter('pending_in_person')
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              paymentFilter === 'pending_in_person'
                ? 'bg-amber-500/20 text-amber-800 font-semibold border border-amber-500/30'
                : 'bg-muted/60 hover:bg-muted text-foreground/70'
            }`}
          >
            ⚡ Unsettled Desk Dues (£{bookings.filter((b) => b.payment_status === 'pending_in_person').length})
          </button>
          <button
            onClick={() => {
              setStatusTab('confirmed')
              setPaymentFilter('all')
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusTab === 'confirmed'
                ? 'bg-emerald-500/20 text-emerald-800 font-semibold border border-emerald-500/30'
                : 'bg-muted/60 hover:bg-muted text-foreground/70'
            }`}
          >
            Confirmed Slots ({bookings.filter((b) => b.status === 'confirmed').length})
          </button>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-2.5 py-1 rounded-lg border border-border/80 text-foreground/70 hover:text-foreground text-[11px] font-medium hover:bg-card transition-colors flex items-center gap-1"
        >
          <PlusCircle className="w-3 h-3 text-gold" />
          <span>Walk-In Booking</span>
        </button>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
          {[
            { id: 'all', label: 'All Bookings', count: bookings.length },
            {
              id: 'pending',
              label: 'Pending',
              count: bookings.filter((b) => b.status === 'pending').length,
            },
            {
              id: 'confirmed',
              label: 'Confirmed',
              count: bookings.filter((b) => b.status === 'confirmed').length,
            },
            {
              id: 'completed',
              label: 'Completed',
              count: bookings.filter((b) => b.status === 'completed').length,
            },
            {
              id: 'cancelled',
              label: 'Cancelled / No-Show',
              count: bookings.filter(
                (b) =>
                  b.status === 'cancelled_by_admin' ||
                  b.status === 'cancelled_by_client' ||
                  b.status === 'no_show'
              ).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card text-foreground/70 hover:text-foreground border border-border/70 hover:bg-muted/40'
              }`}
            >
              {tab.label}{' '}
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusTab === tab.id ? 'bg-gold/20 text-gold' : 'bg-muted text-foreground/50'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter / Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, client name, email, or treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-foreground/40 hidden sm:block" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              <option value="all">All Payment Statuses</option>
              <option value="pending_in_person">Pending In-Person Desk Settlement</option>
              <option value="paid_in_person">Paid In-Person</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center space-y-3">
          <Calendar className="w-8 h-8 text-foreground/30 mx-auto" />
          <p className="text-sm font-medium text-foreground">No appointments found</p>
          <p className="text-xs text-foreground/60 max-w-sm mx-auto">
            No booking records match the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-foreground/60 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Ref & Client</th>
                  <th className="py-3 px-4">Treatment</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Price & Settlement</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right sticky right-0 bg-muted/90 backdrop-blur-xs z-10 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.06)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/25 transition-colors">
                    {/* Ref & Client */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-foreground text-xs">
                        {b.booking_reference}
                      </div>
                      <div className="font-medium text-foreground/90 mt-0.5">
                        {b.client_name}
                      </div>
                      <div className="text-[11px] text-foreground/50 truncate max-w-[180px]">
                        {b.client_email}
                      </div>
                    </td>

                    {/* Treatment */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{b.session_title}</div>
                      <div className="text-[11px] text-gold font-medium">
                        {b.category_name}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        <span>{b.appointment_date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-foreground/50 mt-0.5">
                        <Clock className="w-3 h-3 text-foreground/40" />
                        <span>
                          {b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)}
                        </span>
                      </div>
                    </td>

                    {/* Price & Settlement */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-serif text-sm font-semibold text-foreground">
                        £{b.total_price.toFixed(2)}
                      </div>
                      <div className="mt-0.5">
                        {b.payment_status === 'paid_in_person' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Paid In Person</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Pending Settlement</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
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
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap sticky right-0 bg-card/95 backdrop-blur-xs z-10 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Status Quick Switch */}
                        {b.status === 'pending' && (
                          <button
                            onClick={async () => {
                              updateBooking(b.id, { status: 'confirmed' })
                              await serverUpdateBookingStatus(b.id, 'confirmed')
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 text-[11px] font-medium border border-emerald-500/20 shadow-2xs"
                            title="Confirm appointment"
                          >
                            Confirm
                          </button>
                        )}

                        {b.status === 'confirmed' && (
                          <button
                            onClick={async () => {
                              updateBooking(b.id, { status: 'completed' })
                              await serverUpdateBookingStatus(b.id, 'completed')
                            }}
                            className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 text-[11px] font-medium border border-blue-500/20 shadow-2xs"
                            title="Mark treatment completed"
                          >
                            Complete
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedBookingDetails(b)}
                          className="p-1.5 rounded-lg border border-border/80 bg-background text-foreground hover:text-gold hover:border-gold transition-colors shadow-2xs"
                          title="View complete booking record"
                        >
                          <FileText className="w-3.5 h-3.5 text-gold" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded-lg border border-border/80 bg-background text-foreground hover:text-gold hover:border-gold transition-colors shadow-2xs"
                          title="Edit appointment"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-gold" />
                        </button>

                        {b.status !== 'cancelled_by_admin' && b.status !== 'cancelled_by_client' && (
                          <button
                            onClick={() => setCancellingBooking(b)}
                            className="p-1.5 rounded-lg border border-destructive/30 bg-background text-destructive hover:bg-destructive/10 transition-colors shadow-2xs"
                            title="Cancel appointment"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setDeletingBooking(b)}
                          className="p-1.5 rounded-lg border border-destructive/30 bg-background text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors shadow-2xs"
                          title="Delete appointment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NEW / EDIT APPOINTMENT                                             */}
      {/* ========================================================================= */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {editingBooking ? 'Edit Appointment Record' : 'Schedule New Appointment'}
                </h3>
                <p className="text-xs text-foreground/60">
                  Select patient, clinical procedure, and appointment window.
                </p>
              </div>
              <button
                onClick={() => setIsNewBookingOpen(false)}
                className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Select Client *</label>
                <select
                  value={bookingForm.client_id}
                  onChange={(e) => setBookingForm({ ...bookingForm, client_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Treatment Procedure *</label>
                <select
                  value={bookingForm.session_id}
                  onChange={(e) => setBookingForm({ ...bookingForm, session_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} &bull; £{s.pricing.toFixed(2)} ({s.duration_minutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.appointment_date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, appointment_date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={bookingForm.start_time}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, start_time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Booking Status *</label>
                  <select
                    value={bookingForm.status}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="no_show">No Show</option>
                    <option value="cancelled_by_admin">Cancelled by Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">In-Person Settlement</label>
                  <select
                    value={bookingForm.payment_status}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, payment_status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  >
                    <option value="pending_in_person">Pending Desk Settlement</option>
                    <option value="paid_in_person">Paid In Person</option>
                    <option value="waived">Waived / Complimentary</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Client Request / Notes</label>
                <textarea
                  rows={2}
                  value={bookingForm.client_notes}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, client_notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  placeholder="e.g. Sensitive skin around jawline..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Internal Staff / Admin Notes</label>
                <textarea
                  rows={2}
                  value={bookingForm.admin_notes}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, admin_notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  placeholder="e.g. Consult with Dr. Sterling prior to treatment..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsNewBookingOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/80 text-foreground/70 hover:text-foreground text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm"
                >
                  {editingBooking ? 'Save Appointment' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IN-PERSON DESK PAYMENT                                             */}
      {/* ========================================================================= */}
      {paymentModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-foreground">
                    Front Desk Settlement
                  </h3>
                  <span className="text-[11px] font-mono text-foreground/50">
                    Ref: {paymentModalBooking.booking_reference}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalBooking(null)}
                className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-muted/40 p-4 rounded-xl space-y-2 border border-border/60 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground/60">Client:</span>
                <span className="font-medium text-foreground">
                  {paymentModalBooking.client_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Treatment:</span>
                <span className="font-medium text-foreground">
                  {paymentModalBooking.session_title}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border/60 text-sm">
                <span className="font-semibold text-foreground">Total Due:</span>
                <span className="font-serif font-bold text-gold text-base">
                  £{paymentModalBooking.total_price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-semibold text-foreground/70 block">
                Select Settlement Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('chip_pin')
                    setPaymentNote('Chip & PIN Terminal - Front Desk')
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'chip_pin'
                      ? 'border-gold bg-gold/10 text-foreground font-medium shadow-xs'
                      : 'border-border/80 text-foreground/70 hover:bg-muted/30'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-gold" />
                  <span className="text-[11px] block">Chip & PIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('cash')
                    setPaymentNote(`Cash Received (£${paymentModalBooking.total_price.toFixed(2)})`)
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-gold bg-gold/10 text-foreground font-medium shadow-xs'
                      : 'border-border/80 text-foreground/70 hover:bg-muted/30'
                  }`}
                >
                  <PoundSterling className="w-4 h-4 mx-auto mb-1 text-gold" />
                  <span className="text-[11px] block">Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('voucher')
                    setPaymentNote('Harley Street Clinic Gift Voucher')
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'voucher'
                      ? 'border-gold bg-gold/10 text-foreground font-medium shadow-xs'
                      : 'border-border/80 text-foreground/70 hover:bg-muted/30'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mx-auto mb-1 text-gold" />
                  <span className="text-[11px] block">Voucher</span>
                </button>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-semibold text-foreground/70">Settlement Note</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setPaymentModalBooking(null)}
                className="px-4 py-2 rounded-xl border border-border/80 text-foreground/70 hover:text-foreground text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm"
              >
                Confirm Payment (£{paymentModalBooking.total_price.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW FULL BOOKING RECORD                                           */}
      {/* ========================================================================= */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                  Appointment Dossier
                </span>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  Reference: {selectedBookingDetails.booking_reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Client:</span>
                  <span className="font-semibold text-foreground">
                    {selectedBookingDetails.client_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Email:</span>
                  <span className="font-mono text-foreground/80">
                    {selectedBookingDetails.client_email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Phone:</span>
                  <span className="font-mono text-foreground/80">
                    {selectedBookingDetails.client_phone}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Procedure:</span>
                  <span className="font-semibold text-foreground">
                    {selectedBookingDetails.session_title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Category:</span>
                  <span className="text-gold font-medium">
                    {selectedBookingDetails.category_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Date & Slot:</span>
                  <span className="font-medium text-foreground">
                    {selectedBookingDetails.appointment_date} &bull;{' '}
                    {selectedBookingDetails.start_time.slice(0, 5)} -{' '}
                    {selectedBookingDetails.end_time.slice(0, 5)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border/60 text-sm">
                  <span className="font-semibold text-foreground">Total Fee:</span>
                  <span className="font-serif font-bold text-gold">
                    £{selectedBookingDetails.total_price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">Appointment Status:</span>
                  <span className="font-semibold capitalize text-foreground">
                    {selectedBookingDetails.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">Payment Status:</span>
                  <span className="font-semibold capitalize text-foreground">
                    {selectedBookingDetails.payment_status.replace(/_/g, ' ')}
                  </span>
                </div>
                {selectedBookingDetails.payment_method_note && (
                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <span className="text-foreground/50">Settlement Note:</span>
                    <span className="text-foreground/80 font-mono">
                      {selectedBookingDetails.payment_method_note}
                    </span>
                  </div>
                )}
              </div>

              {selectedBookingDetails.client_notes && (
                <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                  <span className="font-semibold text-foreground/70 block mb-1">
                    Client Notes:
                  </span>
                  <p className="text-foreground/80">{selectedBookingDetails.client_notes}</p>
                </div>
              )}

              {selectedBookingDetails.admin_notes && (
                <div className="p-3 rounded-xl bg-gold/10 border border-gold/30">
                  <span className="font-semibold text-foreground/80 block mb-1">
                    Staff Clinical Notes:
                  </span>
                  <p className="text-foreground/90">{selectedBookingDetails.admin_notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CANCEL APPOINTMENT                                                 */}
      {/* ========================================================================= */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-medium text-foreground">
                Cancel Appointment
              </h3>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Cancel booking ref <strong className="font-mono text-foreground">{cancellingBooking.booking_reference}</strong> for {cancellingBooking.client_name}?
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-foreground/70">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
              >
                <option value="Client requested rescheduling">Client requested rescheduling</option>
                <option value="Client medical contraindication identified">Medical contraindication</option>
                <option value="Clinic staff scheduling conflict">Clinic staff conflict</option>
                <option value="Client did not attend scheduled slot">Client did not attend</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <button
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-medium text-foreground/70 hover:text-foreground"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-destructive text-white text-xs font-semibold hover:opacity-90 shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL: DELETE APPOINTMENT CONFIRMATION                                    */}
      {/* ========================================================================= */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-medium text-foreground">
                Delete Appointment
              </h3>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Are you sure you want to permanently delete booking ref{' '}
              <strong className="font-mono text-foreground">{deletingBooking.booking_reference}</strong>?
              This will remove the appointment from both the agenda and database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <button
                onClick={() => setDeletingBooking(null)}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-medium text-foreground/70 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-destructive text-white text-xs font-semibold hover:opacity-90 shadow-xs"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
