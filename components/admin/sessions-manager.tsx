'use client'

import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Sparkles,
  PlusCircle,
  Search,
  Layers,
  Clock,
  PoundSterling,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  MapPin,
  Tag,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react'
import { useAdminStore } from './admin-store-provider'
import { MockSession, MockCategory } from '@/lib/admin-mock-data'
import {
  createSession,
  updateSession as serverUpdateSession,
  archiveSession,
  deleteSession as serverDeleteSession,
  createSessionCategory,
  updateSessionCategory,
  deleteSessionCategory,
} from '@/actions/admin-sessions'

interface SessionsManagerProps {
  initialCategories?: any[]
  initialSessions?: any[]
}

export function SessionsManager({ initialCategories, initialSessions }: SessionsManagerProps = {}) {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'categories' ? 'categories' : 'treatments'
  const autoAction = searchParams.get('action')

  const [activeTab, setActiveTab] = useState<'treatments' | 'categories'>(initialTab)
  const {
    categories: storeCategories,
    sessions: storeSessions,
    addCategory,
    updateCategory,
    deleteCategory,
    addSession,
    updateSession,
    deleteSession,
    showNotification,
  } = useAdminStore()

  // Prefer live Supabase data if passed, otherwise fallback to store
  const categories = initialCategories && initialCategories.length > 0 ? initialCategories : storeCategories
  const sessions = initialSessions && initialSessions.length > 0 ? initialSessions : storeSessions

  // Search & Filter States
  const [treatmentSearch, setTreatmentSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(autoAction === 'new-treatment')
  const [editingSession, setEditingSession] = useState<MockSession | null>(null)

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(autoAction === 'new-category')
  const [editingCategory, setEditingCategory] = useState<MockCategory | null>(null)

  const [deletingItem, setDeletingItem] = useState<{ type: 'session' | 'category'; id: string; name: string } | null>(
    null
  )

  // Treatment Form State
  const [treatmentForm, setTreatmentForm] = useState({
    title: '',
    slug: '',
    session_type_id: '',
    pricing: 150,
    duration_minutes: 60,
    buffer_minutes: 15,
    max_slots: 4,
    location: 'Harley Street Clinic, Suite 4B',
    status: 'active' as 'active' | 'draft' | 'archived',
    description: '',
    benefitsInput: '',
  })

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    default_duration_minutes: 60,
    buffer_minutes: 15,
    is_active: true,
  })

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(treatmentSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(treatmentSearch.toLowerCase()) ||
        s.benefits.some((b: string) => b.toLowerCase().includes(treatmentSearch.toLowerCase()))

      const matchesCat = categoryFilter === 'all' || s.session_type_id === categoryFilter || s.category_name === categoryFilter
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter

      return matchesSearch && matchesCat && matchesStatus
    })
  }, [sessions, treatmentSearch, categoryFilter, statusFilter])

  // Open Treatment Modal for Create
  const handleOpenNewTreatment = () => {
    setEditingSession(null)
    setTreatmentForm({
      title: '',
      slug: '',
      session_type_id: categories[0]?.id || '',
      pricing: 175,
      duration_minutes: 60,
      buffer_minutes: 15,
      max_slots: 4,
      location: 'Harley Street Clinic, Suite 4B',
      status: 'active',
      description: '',
      benefitsInput: 'Skin rejuvenation, Collagen synthesis, Instant radiance',
    })
    setIsTreatmentModalOpen(true)
  }

  // Open Treatment Modal for Edit
  const handleOpenEditTreatment = (session: MockSession) => {
    setEditingSession(session)
    setTreatmentForm({
      title: session.title,
      slug: session.slug,
      session_type_id: session.session_type_id,
      pricing: session.pricing,
      duration_minutes: session.duration_minutes,
      buffer_minutes: session.buffer_minutes,
      max_slots: session.max_slots,
      location: session.location,
      status: session.status,
      description: session.description,
      benefitsInput: session.benefits.join(', '),
    })
    setIsTreatmentModalOpen(true)
  }

  // Save Treatment
  const handleSaveTreatment = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedCat = categories.find((c) => c.id === treatmentForm.session_type_id)
    const categoryName = selectedCat ? selectedCat.name : 'General Aesthetics'

    const benefitsArray = treatmentForm.benefitsInput
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean)

    const payload = {
      title: treatmentForm.title,
      slug: treatmentForm.slug || treatmentForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      session_type_id: treatmentForm.session_type_id,
      category_name: categoryName,
      pricing: Number(treatmentForm.pricing),
      currency: 'GBP',
      duration_minutes: Number(treatmentForm.duration_minutes),
      buffer_minutes: Number(treatmentForm.buffer_minutes),
      max_slots: Number(treatmentForm.max_slots),
      location: treatmentForm.location,
      status: treatmentForm.status,
      is_ongoing: true,
      description: treatmentForm.description,
      benefits: benefitsArray,
    }

    if (editingSession) {
      updateSession(editingSession.id, payload)
      // Call Supabase Server Action
      await serverUpdateSession(editingSession.id, {
        title: payload.title,
        slug: payload.slug,
        session_type_id: payload.session_type_id,
        pricing: payload.pricing,
        duration_minutes: payload.duration_minutes,
        max_slots: payload.max_slots,
        location: payload.location,
        status: payload.status,
        description: payload.description,
        benefits: payload.benefits,
      })
    } else {
      addSession(payload)
      // Call Supabase Server Action
      await createSession({
        title: payload.title,
        slug: payload.slug,
        session_type_id: payload.session_type_id,
        pricing: payload.pricing,
        duration_minutes: payload.duration_minutes,
        max_slots: payload.max_slots,
        location: payload.location,
        status: payload.status,
        description: payload.description,
        benefits: payload.benefits,
      })
    }

    setIsTreatmentModalOpen(false)
  }

  // Open Category Modal for Create
  const handleOpenNewCategory = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      default_duration_minutes: 60,
      buffer_minutes: 15,
      is_active: true,
    })
    setIsCategoryModalOpen(true)
  }

  // Open Category Modal for Edit
  const handleOpenEditCategory = (cat: MockCategory) => {
    setEditingCategory(cat)
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      default_duration_minutes: cat.default_duration_minutes,
      buffer_minutes: cat.buffer_minutes,
      is_active: cat.is_active,
    })
    setIsCategoryModalOpen(true)
  }

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: categoryForm.name,
      slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: categoryForm.description,
      default_duration_minutes: Number(categoryForm.default_duration_minutes),
      buffer_minutes: Number(categoryForm.buffer_minutes),
      is_active: categoryForm.is_active,
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, payload)
      // Call Supabase Server Action
      await updateSessionCategory(editingCategory.id, payload)
    } else {
      addCategory(payload)
      // Call Supabase Server Action
      await createSessionCategory(payload)
    }

    setIsCategoryModalOpen(false)
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return
    if (deletingItem.type === 'session') {
      deleteSession(deletingItem.id)
      await serverDeleteSession(deletingItem.id)
    } else {
      deleteCategory(deletingItem.id)
      await deleteSessionCategory(deletingItem.id)
    }
    setDeletingItem(null)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">
              Treatment Protocol Management
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground mt-1">
            Treatments & Categories Catalog
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            Configure clinical procedures, pricing, duration, room allocation, and treatment taxonomy.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border/70 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('treatments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'treatments'
                ? 'bg-card text-foreground shadow-xs border border-border/80'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Treatments Catalog ({sessions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-card text-foreground shadow-xs border border-border/80'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-gold" />
            <span>Session Categories ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TREATMENTS CATALOG                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'treatments' && (
        <div className="space-y-6">
          {/* Contextual Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-muted/20 p-2.5 rounded-xl border border-border/50">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider mr-1">
                Contextual Triage:
              </span>
              <button
                onClick={() => {
                  setCategoryFilter('all')
                  setStatusFilter('all')
                  setTreatmentSearch('')
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all' && categoryFilter === 'all' && !treatmentSearch
                    ? 'bg-card text-foreground font-semibold shadow-2xs border border-border/70'
                    : 'bg-muted/60 hover:bg-muted text-foreground/70'
                }`}
              >
                All ({sessions.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-emerald-500/20 text-emerald-800 font-semibold border border-emerald-500/30'
                    : 'bg-muted/60 hover:bg-muted text-foreground/70'
                }`}
              >
                Active Only ({sessions.filter((s) => s.status === 'active').length})
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === 'draft'
                    ? 'bg-amber-500/20 text-amber-800 font-semibold border border-amber-500/30'
                    : 'bg-muted/60 hover:bg-muted text-foreground/70'
                }`}
              >
                Drafts ({sessions.filter((s) => s.status === 'draft').length})
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNewCategory}
                className="px-2.5 py-1 rounded-lg border border-border/80 text-foreground/70 hover:text-foreground text-[11px] font-medium hover:bg-card transition-colors flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3 text-gold" />
                <span>New Category</span>
              </button>
            </div>
          </div>

          {/* Controls & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/80 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search treatments or clinical benefits..."
                  value={treatmentSearch}
                  onChange={(e) => setTreatmentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <button
              onClick={handleOpenNewTreatment}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-gold" />
              <span>Add New Treatment</span>
            </button>
          </div>

          {/* Treatments Grid */}
          {filteredSessions.length === 0 ? (
            <div className="bg-card border border-border/80 rounded-2xl p-12 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-foreground/30 mx-auto" />
              <p className="text-sm font-medium text-foreground">No treatment sessions found</p>
              <p className="text-xs text-foreground/60 max-w-sm mx-auto">
                No procedures match the selected search or filters. Try adjusting your search or add a new treatment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gold/60 transition-all group"
                >
                  <div className="space-y-3">
                    {/* Header: Category & Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-gold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/20">
                        {session.category_name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                          session.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                            : session.status === 'draft'
                            ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                            : 'bg-muted text-foreground/50 border-border'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-gold transition-colors">
                        {session.title}
                      </h3>
                      <p className="text-xs text-foreground/60 line-clamp-2 mt-1">
                        {session.description}
                      </p>
                    </div>

                    {/* Benefits Tags */}
                    {session.benefits && session.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {session.benefits.slice(0, 3).map((benefit: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-muted/60 text-foreground/70 px-2 py-0.5 rounded-md border border-border/50"
                          >
                            {benefit}
                          </span>
                        ))}
                        {session.benefits.length > 3 && (
                          <span className="text-[10px] text-foreground/40 self-center">
                            +{session.benefits.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Duration Bar */}
                  <div className="mt-4 pt-4 border-t border-border/60 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-serif text-base font-semibold text-foreground">
                        <span>£{session.pricing.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/60 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          <span>{session.duration_minutes}m</span>
                        </span>
                        <span>+{session.buffer_minutes}m buffer</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-foreground/50">
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="w-3 h-3 text-gold shrink-0" />
                        <span className="truncate">{session.location}</span>
                      </span>
                      <span>Max {session.max_slots} slots/day</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => handleOpenEditTreatment(session)}
                        className="px-3 py-1.5 rounded-lg border border-border/80 text-xs font-medium text-foreground hover:bg-muted/50 flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-gold" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeletingItem({
                            type: 'session',
                            id: session.id,
                            name: session.title,
                          })
                        }
                        className="p-1.5 rounded-lg border border-border/80 text-destructive hover:bg-destructive/10 transition-colors"
                        title="Archive treatment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SESSION CATEGORIES                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/80 shadow-xs">
            <div>
              <h2 className="font-serif text-lg font-medium text-foreground">
                Treatment Categories Taxonomy
              </h2>
              <p className="text-xs text-foreground/60">
                Categories group treatments and define default operational durations and clinical buffers.
              </p>
            </div>
            <button
              onClick={handleOpenNewCategory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-gold" />
              <span>Create New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const assignedSessions = sessions.filter(
                (s) => s.session_type_id === cat.id || s.category_name === cat.name
              )

              return (
                <div
                  key={cat.id}
                  className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gold/60 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-foreground/50">
                        /{cat.slug}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                          cat.is_active
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                            : 'bg-muted text-foreground/50 border-border'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-gold transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-foreground/60 mt-1 line-clamp-3">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-foreground/70 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span>Default: {cat.default_duration_minutes} mins</span>
                      </span>
                      <span>+{cat.buffer_minutes}m buffer</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground/70 bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
                      {assignedSessions.length} treatments assigned
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="px-3 py-1.5 rounded-lg border border-border/80 text-xs font-medium text-foreground hover:bg-muted/50 flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-gold" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeletingItem({
                            type: 'category',
                            id: cat.id,
                            name: cat.name,
                          })
                        }
                        className="p-1.5 rounded-lg border border-border/80 text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT TREATMENT SESSION                                       */}
      {/* ========================================================================= */}
      {isTreatmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {editingSession ? 'Edit Treatment Offering' : 'New Treatment Session'}
                </h3>
                <p className="text-xs text-foreground/60">
                  Fill in clinical protocol parameters, pricing, and timing.
                </p>
              </div>
              <button
                onClick={() => setIsTreatmentModalOpen(false)}
                className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Treatment Title *</label>
                  <input
                    type="text"
                    required
                    value={treatmentForm.title}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                    placeholder="e.g. Microneedling Collagen Infusion"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">URL Slug</label>
                  <input
                    type="text"
                    value={treatmentForm.slug}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                    placeholder="e.g. microneedling-collagen-infusion"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Category Taxonomy *</label>
                  <select
                    value={treatmentForm.session_type_id}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, session_type_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Pricing (£ GBP) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={treatmentForm.pricing}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, pricing: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Status *</label>
                  <select
                    value={treatmentForm.status}
                    onChange={(e) =>
                      setTreatmentForm({ ...treatmentForm, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  >
                    <option value="active">Active (Available for booking)</option>
                    <option value="draft">Draft (Internal review)</option>
                    <option value="archived">Archived (Retired)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    value={treatmentForm.duration_minutes}
                    onChange={(e) =>
                      setTreatmentForm({ ...treatmentForm, duration_minutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Sanitization Buffer (Mins)</label>
                  <input
                    type="number"
                    value={treatmentForm.buffer_minutes}
                    onChange={(e) =>
                      setTreatmentForm({ ...treatmentForm, buffer_minutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Max Slots / Day</label>
                  <input
                    type="number"
                    value={treatmentForm.max_slots}
                    onChange={(e) =>
                      setTreatmentForm({ ...treatmentForm, max_slots: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Clinic Suite / Room Location</label>
                <input
                  type="text"
                  value={treatmentForm.location}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  placeholder="e.g. Harley Street Clinic, Suite 4B"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Clinical Benefits (Comma-separated)</label>
                <input
                  type="text"
                  value={treatmentForm.benefitsInput}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, benefitsInput: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  placeholder="e.g. Collagen stimulation, Epidermal smoothing, Radiance restore"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Clinical Description</label>
                <textarea
                  rows={3}
                  value={treatmentForm.description}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  placeholder="Describe patient consultation steps, indications, and aftercare recommendations..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsTreatmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/80 text-foreground/70 hover:text-foreground text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm"
                >
                  {editingSession ? 'Save Changes' : 'Create Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT SESSION CATEGORY                                        */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {editingCategory ? 'Edit Treatment Category' : 'New Session Category'}
                </h3>
                <p className="text-xs text-foreground/60">
                  Taxonomy grouping for clinical procedures.
                </p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  placeholder="e.g. Facial Aesthetics"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">URL Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  placeholder="e.g. facial-aesthetics"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Default Duration (Mins)</label>
                  <input
                    type="number"
                    value={categoryForm.default_duration_minutes}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        default_duration_minutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70">Buffer Time (Mins)</label>
                  <input
                    type="number"
                    value={categoryForm.buffer_minutes}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        buffer_minutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground/70">Description</label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs"
                  placeholder="Describe treatment category focus, indications, and protocol overview..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={categoryForm.is_active}
                  onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-gold/40"
                />
                <label htmlFor="catActive" className="font-medium text-foreground cursor-pointer">
                  Active in client booking directory
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/80 text-foreground/70 hover:text-foreground text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm"
                >
                  {editingCategory ? 'Save Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION                                                */}
      {/* ========================================================================= */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-medium text-foreground">
                Confirm Removal
              </h3>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Are you sure you want to remove {deletingItem.type === 'session' ? 'treatment' : 'category'}{' '}
              <strong className="text-foreground">&ldquo;{deletingItem.name}&rdquo;</strong>? This action can be undone by resetting mock data.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-medium text-foreground/70 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-destructive text-white text-xs font-semibold hover:opacity-90 shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
