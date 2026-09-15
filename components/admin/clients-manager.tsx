'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Users,
  Search,
  PlusCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Eye,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  ShieldAlert,
  Clock,
  PoundSterling,
  CalendarPlus,
  Shield,
} from 'lucide-react'
import { useAdminStore } from './admin-store-provider'
import { MockClient } from '@/lib/admin-mock-data'
import {
  updateClientProfile,
  updateClientStatus,
  createClientRecord,
  deleteClientRecord,
} from '@/actions/admin-clients'

interface ClientsManagerProps {
  initialClients?: MockClient[]
  currentUserId?: string
}

export function ClientsManager({ initialClients, currentUserId }: ClientsManagerProps = {}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const autoAction = searchParams.get('action')

  const { clients: storeClients, bookings, addClient, updateClient, deleteClient } = useAdminStore()
  const [clients, setClients] = useState<MockClient[]>(
    initialClients && initialClients.length > 0 ? initialClients : storeClients
  )

  useEffect(() => {
    if (initialClients && initialClients.length > 0) {
      setClients(initialClients)
    }
  }, [initialClients])

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals & Drawers
  const [isNewClientOpen, setIsNewClientOpen] = useState(autoAction === 'new')
  const [editingClient, setEditingClient] = useState<MockClient | null>(null)
  const [selectedClient360, setSelectedClient360] = useState<MockClient | null>(null)
  const [deletingClient, setDeletingClient] = useState<MockClient | null>(null)

  // Client Form State
  const [clientForm, setClientForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '1990-01-01',
    address_line1: '',
    address_line2: '',
    city: 'London',
    postal_code: '',
    country: 'United Kingdom',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_allergies: '',
    role: 'client' as 'client' | 'user',
    status: 'active' as 'active' | 'suspended' | 'banned',
  })

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.medical_allergies.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [clients, searchQuery, statusFilter])

  // Open New Client Modal
  const handleOpenNew = () => {
    setEditingClient(null)
    setClientForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '+44 7700 ',
      date_of_birth: '1992-05-15',
      address_line1: '14 Harley Street',
      address_line2: '',
      city: 'London',
      postal_code: 'W1G 9PQ',
      country: 'United Kingdom',
      emergency_contact_name: '',
      emergency_contact_phone: '+44 7700 ',
      medical_allergies: 'None recorded',
      role: 'client',
      status: 'active',
    })
    setIsNewClientOpen(true)
  }

  // Open Edit Client Modal
  const handleOpenEdit = (c: MockClient) => {
    setEditingClient(c)
    setClientForm({
      first_name: c.first_name,
      last_name: c.last_name,
      email: c.email,
      phone: c.phone,
      date_of_birth: c.date_of_birth,
      address_line1: c.address_line1,
      address_line2: c.address_line2 || '',
      city: c.city,
      postal_code: c.postal_code,
      country: c.country,
      emergency_contact_name: c.emergency_contact_name,
      emergency_contact_phone: c.emergency_contact_phone,
      medical_allergies: c.medical_allergies,
      role: c.role,
      status: c.status,
    })
    setIsNewClientOpen(true)
  }

  // Save Client Form
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      first_name: clientForm.first_name,
      last_name: clientForm.last_name,
      email: clientForm.email,
      phone: clientForm.phone,
      avatar_url: null,
      date_of_birth: clientForm.date_of_birth,
      address_line1: clientForm.address_line1,
      address_line2: clientForm.address_line2 || undefined,
      city: clientForm.city,
      postal_code: clientForm.postal_code,
      country: clientForm.country,
      emergency_contact_name: clientForm.emergency_contact_name,
      emergency_contact_phone: clientForm.emergency_contact_phone,
      medical_allergies: clientForm.medical_allergies,
      role: clientForm.role,
      status: clientForm.status,
    }

    if (editingClient) {
      updateClient(editingClient.id, payload)
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? { ...c, ...payload } : c))
      )
      if (selectedClient360?.id === editingClient.id) {
        setSelectedClient360({ ...selectedClient360, ...payload })
      }
      setIsNewClientOpen(false)
      await updateClientProfile(editingClient.id, payload)
    } else {
      addClient(payload)
      setIsNewClientOpen(false)
      const res = await createClientRecord(payload)
      if (res.success && res.data) {
        const createdMock: MockClient = {
          ...payload,
          id: res.data.id,
          total_bookings: 0,
          total_spend: 0,
          last_visit: 'Never',
          created_at: res.data.created_at || new Date().toISOString(),
        }
        setClients((prev) => [createdMock, ...prev])
      }
    }
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingClient) return
    const idToDelete = deletingClient.id
    deleteClient(idToDelete)
    setClients((prev) => prev.filter((c) => c.id !== idToDelete))
    if (selectedClient360?.id === idToDelete) {
      setSelectedClient360(null)
    }
    setDeletingClient(null)
    await deleteClientRecord(idToDelete)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">
              Clinical Registry & Records
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground mt-1">
            Client Directory & Medical Intake
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            Maintain client profiles, medical allergies, emergency contacts, and visit histories.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-gold" />
          <span>Register New Client</span>
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
              setStatusFilter('all')
              setSearchQuery('')
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'all' && !searchQuery
                ? 'bg-card text-foreground font-semibold shadow-2xs border border-border/70'
                : 'bg-muted/60 hover:bg-muted text-foreground/70'
            }`}
          >
            All Clients ({clients.length})
          </button>
          <button
            onClick={() => {
              setStatusFilter('all')
              setSearchQuery('penicillin')
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              searchQuery.toLowerCase() === 'penicillin'
                ? 'bg-amber-500/20 text-amber-900 font-semibold border border-amber-500/30'
                : 'bg-muted/60 hover:bg-muted text-foreground/70'
            }`}
          >
            ⚠️ Allergy Alerts ({clients.filter((c) => c.medical_allergies && c.medical_allergies.toLowerCase() !== 'none' && c.medical_allergies.toLowerCase() !== 'none recorded').length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-emerald-500/20 text-emerald-800 font-semibold border border-emerald-500/30'
                : 'bg-muted/60 hover:bg-muted text-foreground/70'
            }`}
          >
            Active Accounts ({clients.filter((c) => c.status === 'active').length})
          </button>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-2.5 py-1 rounded-lg border border-border/80 text-foreground/70 hover:text-foreground text-[11px] font-medium hover:bg-card transition-colors flex items-center gap-1"
        >
          <PlusCircle className="w-3 h-3 text-gold" />
          <span>+ Register Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients, phone, city, or medical allergies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
          >
            <option value="all">All Statuses ({clients.length})</option>
            <option value="active">Active Accounts</option>
            <option value="suspended">Suspended Accounts</option>
            <option value="banned">Banned Accounts</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      {filteredClients.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center space-y-3">
          <Users className="w-8 h-8 text-foreground/30 mx-auto" />
          <p className="text-sm font-medium text-foreground">No client profiles found</p>
          <p className="text-xs text-foreground/60 max-w-sm mx-auto">
            Try adjusting your search terms or register a new client profile.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-foreground/60 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Client Name & Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Intake Contraindications</th>
                  <th className="py-3 px-4">Visits & Spend</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right sticky right-0 bg-muted/90 backdrop-blur-xs z-10 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.06)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredClients.map((client) => {
                  const initials = `${client.first_name[0] || ''}${client.last_name[0] || ''}`.toUpperCase()
                  const hasAllergies =
                    client.medical_allergies &&
                    client.medical_allergies.toLowerCase() !== 'none' &&
                    client.medical_allergies.toLowerCase() !== 'none recorded'

                  return (
                    <tr 
                      key={client.id} 
                      className="hover:bg-muted/25 transition-colors cursor-pointer"
                      onClick={() => setSelectedClient360(client)}
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-border/80 font-serif text-xs font-semibold flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <button
                              onClick={() => setSelectedClient360(client)}
                              className="font-medium text-foreground hover:text-gold transition-colors text-left flex items-center gap-2"
                            >
                              <span>{client.first_name} {client.last_name}</span>
                              {client.id === currentUserId && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold bg-gold/20 text-gold border border-gold/30">
                                  You
                                </span>
                              )}
                            </button>
                            <div className="flex items-center gap-2 text-[11px] text-foreground/50 mt-0.5">
                              <span>{client.email}</span>
                              <span>&bull;</span>
                              <span>{client.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <MapPin className="w-3 h-3 text-gold" />
                          <span>{client.city}</span>
                        </div>
                        <div className="text-[11px] text-foreground/50 font-mono mt-0.5">
                          {client.postal_code}
                        </div>
                      </td>

                      {/* Allergies */}
                      <td className="py-3.5 px-4">
                        {hasAllergies ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-800 border border-amber-500/30">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            {client.medical_allergies}
                          </span>
                        ) : (
                          <span className="text-[11px] text-foreground/50">
                            None recorded
                          </span>
                        )}
                      </td>

                      {/* Visits & Spend */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-serif font-semibold text-foreground text-xs">
                          £{client.total_spend.toFixed(2)}
                        </div>
                        <div className="text-[11px] text-foreground/50 mt-0.5">
                          {client.total_bookings} appointments &bull; Last: {client.last_visit}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                            client.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                              : client.status === 'suspended'
                              ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                              : 'bg-red-500/10 text-red-700 border-red-500/20'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap sticky right-0 bg-card/95 backdrop-blur-xs z-10 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient360(client);
                            }}
                            className="p-1.5 rounded-lg border border-border/80 bg-background text-foreground hover:text-gold hover:border-gold transition-colors shadow-2xs"
                            title="View Client Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-gold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTER / EDIT CLIENT                                             */}
      {/* ========================================================================= */}
      {isNewClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {editingClient ? 'Edit Client Record' : 'Register New Client'}
                </h3>
                <p className="text-xs text-foreground/60">
                  Record intake information, emergency contacts, and medical contraindications.
                </p>
              </div>
              <button
                onClick={() => setIsNewClientOpen(false)}
                className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">First Name *</label>
                  <input
                    type="text"
                    required
                    value={clientForm.first_name}
                    onChange={(e) => setClientForm({ ...clientForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                    placeholder="e.g. Eleanor"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={clientForm.last_name}
                    onChange={(e) => setClientForm({ ...clientForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                    placeholder="e.g. Vance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                    placeholder="e.g. eleanor.vance@mayfair.co.uk"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                    placeholder="e.g. +44 7700 900123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Date of Birth</label>
                  <input
                    type="date"
                    value={clientForm.date_of_birth}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, date_of_birth: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Account Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  >
                    <option value="active">Active Client</option>
                    <option value="suspended">Suspended (Requires Review)</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              {/* Address Section */}
              <div className="pt-2 border-t border-border/60">
                <span className="font-semibold text-foreground/80 block mb-2">
                  Address Details
                </span>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-foreground/70">Street Address</label>
                    <input
                      type="text"
                      value={clientForm.address_line1}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, address_line1: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                      placeholder="e.g. 14 Berkeley Square"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-foreground/70">City</label>
                      <input
                        type="text"
                        value={clientForm.city}
                        onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-foreground/70">Postal Code</label>
                      <input
                        type="text"
                        value={clientForm.postal_code}
                        onChange={(e) =>
                          setClientForm({ ...clientForm, postal_code: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-border/60">
                <span className="font-semibold text-foreground/80 block mb-2">
                  Emergency Contact
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-foreground/70">Contact Name</label>
                    <input
                      type="text"
                      value={clientForm.emergency_contact_name}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, emergency_contact_name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                      placeholder="e.g. Julian Vance (Spouse)"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-foreground/70">Contact Phone</label>
                    <input
                      type="tel"
                      value={clientForm.emergency_contact_phone}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, emergency_contact_phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                      placeholder="e.g. +44 7700 900888"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Allergies */}
              <div className="pt-2 border-t border-border/60 space-y-1">
                <label className="font-semibold text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Medical Allergies & Contraindications (Crucial for Clinicians)
                </label>
                <textarea
                  rows={2}
                  value={clientForm.medical_allergies}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, medical_allergies: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/40 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs"
                  placeholder="List any drug allergies, lidocaine sensitivity, pregnancy, or keloid scarring history..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsNewClientOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/80 text-foreground/70 hover:text-foreground text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm"
                >
                  {editingClient ? 'Save Profile' : 'Register Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER / MODAL: CLIENT 360 VIEW                                           */}
      {/* ========================================================================= */}
      {selectedClient360 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-serif text-sm font-semibold flex items-center justify-center">
                  {`${selectedClient360.first_name[0] || ''}${selectedClient360.last_name[0] || ''}`.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
                    <span>{selectedClient360.first_name} {selectedClient360.last_name}</span>
                    {selectedClient360.id === currentUserId && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-gold/20 text-gold border border-gold/30">
                        You
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-foreground/60 mt-0.5">
                    <span className="font-mono">{selectedClient360.email}</span>
                    <span>&bull;</span>
                    <span>{selectedClient360.phone}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient360(null)}
                className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Medical Contraindication Alert Box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Clinical Contraindications & Medical Allergies</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium pl-6">
                {selectedClient360.medical_allergies || 'No allergies recorded.'}
              </p>
            </div>

            {/* Summary KPI Badges */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
                <span className="text-[10px] uppercase font-semibold text-foreground/50 block">
                  Total Spend
                </span>
                <span className="font-serif text-lg font-bold text-gold">
                  £{selectedClient360.total_spend.toFixed(2)}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
                <span className="text-[10px] uppercase font-semibold text-foreground/50 block">
                  Bookings
                </span>
                <span className="font-serif text-lg font-bold text-foreground">
                  {selectedClient360.total_bookings}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
                <span className="text-[10px] uppercase font-semibold text-foreground/50 block">
                  Account Status
                </span>
                <span className="font-serif text-sm font-bold text-emerald-700 uppercase">
                  {selectedClient360.status}
                </span>
              </div>
            </div>

            {/* Address & Emergency Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1">
                <span className="font-semibold text-foreground/80 block">Residential Address:</span>
                <p className="text-foreground/70">
                  {selectedClient360.address_line1}
                  {selectedClient360.address_line2 ? `, ${selectedClient360.address_line2}` : ''}
                  <br />
                  {selectedClient360.city}, {selectedClient360.postal_code}
                  <br />
                  {selectedClient360.country}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1">
                <span className="font-semibold text-foreground/80 block">Emergency Contact:</span>
                <p className="text-foreground/70">
                  <span className="font-medium text-foreground">{selectedClient360.emergency_contact_name}</span>
                  <br />
                  Phone: <span className="font-mono">{selectedClient360.emergency_contact_phone}</span>
                </p>
              </div>
            </div>

            {/* Booking History for this Client */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-medium text-foreground">
                  Appointment History Ledger
                </h4>
                <button
                  onClick={() => {
                    setSelectedClient360(null)
                    router.push(`/admin/bookings?action=new`)
                  }}
                  className="text-xs text-gold hover:text-foreground font-medium flex items-center gap-1"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Book New Slot</span>
                </button>
              </div>

              {bookings.filter((b) => b.client_id === selectedClient360.id || b.client_name.includes(selectedClient360.first_name)).length === 0 ? (
                <div className="text-center py-6 text-xs text-foreground/50 border border-dashed border-border/70 rounded-xl">
                  No appointments logged for this client yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {bookings
                    .filter((b) => b.client_id === selectedClient360.id || b.client_name.includes(selectedClient360.first_name))
                    .map((bk) => (
                      <div
                        key={bk.id}
                        className="p-3 rounded-xl border border-border/60 flex items-center justify-between text-xs hover:bg-muted/20"
                      >
                        <div>
                          <div className="font-medium text-foreground">{bk.session_title}</div>
                          <div className="text-[11px] text-foreground/50 mt-0.5">
                            {bk.appointment_date} &bull; Ref: {bk.booking_reference}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-serif font-semibold text-foreground">
                            £{bk.total_price.toFixed(2)}
                          </div>
                          <span
                            className={`text-[10px] uppercase font-semibold px-2 py-0.2 rounded-full border ${
                              bk.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                                : bk.status === 'completed'
                                ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                                : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                            }`}
                          >
                            {bk.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
              <div>
                {selectedClient360.status === 'active' ? (
                  <button
                    onClick={async () => {
                      const newStatus = 'suspended'
                      updateClient(selectedClient360.id, { status: newStatus })
                      setClients((prev) =>
                        prev.map((c) => (c.id === selectedClient360.id ? { ...c, status: newStatus } : c))
                      )
                      setSelectedClient360({ ...selectedClient360, status: newStatus })
                      await updateClientStatus(selectedClient360.id, newStatus, 'Moderated via Client 360 drawer')
                    }}
                    className="px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-800 hover:bg-amber-500/10 text-xs font-medium flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    <span>Suspend Account</span>
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      const newStatus = 'active'
                      updateClient(selectedClient360.id, { status: newStatus })
                      setClients((prev) =>
                        prev.map((c) => (c.id === selectedClient360.id ? { ...c, status: newStatus } : c))
                      )
                      setSelectedClient360({ ...selectedClient360, status: newStatus })
                      await updateClientStatus(selectedClient360.id, newStatus, 'Re-activated via Client 360 drawer')
                    }}
                    className="px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-800 hover:bg-emerald-500/10 text-xs font-medium flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Re-activate Account</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDeletingClient(selectedClient360)
                  }}
                  disabled={selectedClient360.id === currentUserId}
                  className={`px-4 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
                    selectedClient360.id === currentUserId
                      ? 'border-border/40 text-foreground/30 bg-muted/30 cursor-not-allowed'
                      : 'border-destructive/30 text-destructive/80 hover:text-destructive hover:bg-destructive/10'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => handleOpenEdit(selectedClient360)}
                  className="px-4 py-2 rounded-xl border border-border/80 text-foreground/80 hover:text-foreground text-xs font-medium flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gold" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedClient360(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CLIENT CONFIRMATION                                         */}
      {/* ========================================================================= */}
      {deletingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-medium text-foreground">
                Delete Client Profile
              </h3>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Are you sure you want to remove <strong className="text-foreground">{deletingClient.first_name} {deletingClient.last_name}</strong>? Their historical records can be restored anytime by clicking Reset Mock Data.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <button
                onClick={() => setDeletingClient(null)}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-medium text-foreground/70 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-destructive text-white text-xs font-semibold hover:opacity-90 shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
