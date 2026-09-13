'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  MockCategory,
  MockSession,
  MockClient,
  MockBooking,
  INITIAL_CATEGORIES,
  INITIAL_SESSIONS,
  INITIAL_CLIENTS,
  INITIAL_BOOKINGS,
} from '@/lib/admin-mock-data'

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  type: 'booking' | 'payment' | 'client' | 'system'
  isRead: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Appointment Scheduled',
    message: 'Sophia Laurent booked Nano-Peptide Lift & Sculpt for Sep 14, 14:00.',
    timestamp: '12 mins ago',
    type: 'booking',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'In-Person Payment Settled',
    message: '£195.00 settled via Chip & PIN Terminal for Charlotte Hughes (AUR-65231).',
    timestamp: '45 mins ago',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Clinical Intake Alert',
    message: 'Eleanor Vance profile updated with active allergy flags: Penicillin, Topical Retinoids.',
    timestamp: '2 hours ago',
    type: 'client',
    isRead: false,
  },
  {
    id: 'notif-4',
    title: 'Appointment Completed',
    message: 'Dr. Alexander Sterling completed Clinical Diamond Microdermabrasion.',
    timestamp: 'Yesterday',
    type: 'booking',
    isRead: true,
  },
]

interface AdminStoreContextType {
  categories: MockCategory[]
  sessions: MockSession[]
  clients: MockClient[]
  bookings: MockBooking[]
  isHydrated: boolean

  // Sidebar collapsible
  isSidebarCollapsed: boolean
  toggleSidebar: () => void

  // Notification Center
  notifications: NotificationItem[]
  unreadCount: number
  addNotification: (notif: Omit<NotificationItem, 'id' | 'isRead' | 'timestamp'>) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void

  // Categories CRUD
  addCategory: (category: Omit<MockCategory, 'id'>) => MockCategory
  updateCategory: (id: string, updates: Partial<MockCategory>) => void
  deleteCategory: (id: string) => void

  // Sessions CRUD
  addSession: (session: Omit<MockSession, 'id'>) => MockSession
  updateSession: (id: string, updates: Partial<MockSession>) => void
  deleteSession: (id: string) => void

  // Clients CRUD
  addClient: (client: Omit<MockClient, 'id' | 'created_at' | 'total_bookings' | 'total_spend' | 'last_visit'>) => MockClient
  updateClient: (id: string, updates: Partial<MockClient>) => void
  deleteClient: (id: string) => void

  // Bookings CRUD
  addBooking: (booking: Omit<MockBooking, 'id' | 'booking_reference'>) => MockBooking
  updateBooking: (id: string, updates: Partial<MockBooking>) => void
  deleteBooking: (id: string) => void
  recordDeskPayment: (bookingId: string, paymentMethodNote: string) => void

  // Global actions
  resetToDefaults: () => void
  notification: string | null
  showNotification: (msg: string) => void
}

const AdminStoreContext = createContext<AdminStoreContextType | null>(null)

const STORAGE_KEYS = {
  CATEGORIES: 'auralixa_admin_mock_categories_v1',
  SESSIONS: 'auralixa_admin_mock_sessions_v1',
  CLIENTS: 'auralixa_admin_mock_clients_v1',
  BOOKINGS: 'auralixa_admin_mock_bookings_v1',
  NOTIFICATIONS: 'auralixa_admin_mock_notifications_v1',
  SIDEBAR_COLLAPSED: 'auralixa_admin_sidebar_collapsed_v1',
}

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<MockCategory[]>(INITIAL_CATEGORIES)
  const [sessions, setSessions] = useState<MockSession[]>(INITIAL_SESSIONS)
  const [clients, setClients] = useState<MockClient[]>(INITIAL_CLIENTS)
  const [bookings, setBookings] = useState<MockBooking[]>(INITIAL_BOOKINGS)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS)
      const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS)
      const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
      const savedSidebar = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED)

      if (savedCats) setCategories(JSON.parse(savedCats))
      if (savedSessions) setSessions(JSON.parse(savedSessions))
      if (savedClients) setClients(JSON.parse(savedClients))
      if (savedBookings) setBookings(JSON.parse(savedBookings))
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs))
      if (savedSidebar !== null) setIsSidebarCollapsed(JSON.parse(savedSidebar))
    } catch (e) {
      console.warn('Failed to hydrate admin store from localStorage, using defaults:', e)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(next))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }

  // Persist helpers
  const persistCategories = (newCats: MockCategory[]) => {
    setCategories(newCats)
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCats))
    } catch (e) {
      console.error(e)
    }
  }

  const persistSessions = (newSessions: MockSession[]) => {
    setSessions(newSessions)
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(newSessions))
    } catch (e) {
      console.error(e)
    }
  }

  const persistClients = (newClients: MockClient[]) => {
    setClients(newClients)
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(newClients))
    } catch (e) {
      console.error(e)
    }
  }

  const persistBookings = (newBookings: MockBooking[]) => {
    setBookings(newBookings)
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(newBookings))
    } catch (e) {
      console.error(e)
    }
  }

  const persistNotifications = (newNotifs: NotificationItem[]) => {
    setNotifications(newNotifs)
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newNotifs))
    } catch (e) {
      console.error(e)
    }
  }

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr))
    }, 4000)
  }

  // Notification center operations
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'isRead' | 'timestamp'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    }
    const updated = [newItem, ...notifications]
    persistNotifications(updated)
  }

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }))
    persistNotifications(updated)
  }

  const clearNotifications = () => {
    persistNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Categories CRUD
  const addCategory = (catData: Omit<MockCategory, 'id'>): MockCategory => {
    const newCategory: MockCategory = {
      ...catData,
      id: `cat-${Date.now()}`,
    }
    const updated = [newCategory, ...categories]
    persistCategories(updated)
    showNotification(`Category "${newCategory.name}" created successfully.`)
    addNotification({
      title: 'New Treatment Category',
      message: `Taxonomy category "${newCategory.name}" added to clinic offerings.`,
      type: 'system',
    })
    return newCategory
  }

  const updateCategory = (id: string, updates: Partial<MockCategory>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
    persistCategories(updated)
    showNotification(`Category updated.`)
  }

  const deleteCategory = (id: string) => {
    const target = categories.find((c) => c.id === id)
    const updated = categories.filter((c) => c.id !== id)
    persistCategories(updated)
    showNotification(`Category "${target?.name || id}" removed.`)
  }

  // Sessions CRUD
  const addSession = (sessionData: Omit<MockSession, 'id'>): MockSession => {
    const newSession: MockSession = {
      ...sessionData,
      id: `ses-${Date.now()}`,
    }
    const updated = [newSession, ...sessions]
    persistSessions(updated)
    showNotification(`Treatment "${newSession.title}" added to catalog.`)
    addNotification({
      title: 'New Treatment Added',
      message: `"${newSession.title}" added to catalog (£${newSession.pricing.toFixed(2)}).`,
      type: 'system',
    })
    return newSession
  }

  const updateSession = (id: string, updates: Partial<MockSession>) => {
    const updated = sessions.map((s) => (s.id === id ? { ...s, ...updates } : s))
    persistSessions(updated)
    showNotification(`Treatment updated.`)
  }

  const deleteSession = (id: string) => {
    const target = sessions.find((s) => s.id === id)
    const updated = sessions.filter((s) => s.id !== id)
    persistSessions(updated)
    showNotification(`Treatment "${target?.title || id}" archived.`)
  }

  // Clients CRUD
  const addClient = (
    clientData: Omit<MockClient, 'id' | 'created_at' | 'total_bookings' | 'total_spend' | 'last_visit'>
  ): MockClient => {
    const newClient: MockClient = {
      ...clientData,
      id: `cli-${Date.now()}`,
      created_at: new Date().toISOString(),
      total_bookings: 0,
      total_spend: 0,
      last_visit: 'Never',
    }
    const updated = [newClient, ...clients]
    persistClients(updated)
    showNotification(`Client "${newClient.first_name} ${newClient.last_name}" registered.`)
    addNotification({
      title: 'New Patient Registered',
      message: `${newClient.first_name} ${newClient.last_name} enrolled in clinical registry.`,
      type: 'client',
    })
    return newClient
  }

  const updateClient = (id: string, updates: Partial<MockClient>) => {
    const updated = clients.map((c) => (c.id === id ? { ...c, ...updates } : c))
    persistClients(updated)
    showNotification(`Client profile updated.`)
  }

  const deleteClient = (id: string) => {
    const target = clients.find((c) => c.id === id)
    const updated = clients.filter((c) => c.id !== id)
    persistClients(updated)
    showNotification(`Client "${target?.first_name} ${target?.last_name}" removed.`)
  }

  // Bookings CRUD
  const addBooking = (bookingData: Omit<MockBooking, 'id' | 'booking_reference'>): MockBooking => {
    const randomRef = `AUR-${Math.floor(10000 + Math.random() * 90000)}`
    const newBooking: MockBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      booking_reference: randomRef,
    }
    const updated = [newBooking, ...bookings]
    persistBookings(updated)

    // Update client total bookings if client exists
    if (newBooking.client_id) {
      setClients((curr) => {
        const clientUpdated = curr.map((cl) => {
          if (cl.id === newBooking.client_id) {
            return {
              ...cl,
              total_bookings: cl.total_bookings + 1,
              last_visit: newBooking.appointment_date,
            }
          }
          return cl
        })
        persistClients(clientUpdated)
        return clientUpdated
      })
    }

    showNotification(`Booking ${randomRef} created for ${newBooking.client_name}.`)
    addNotification({
      title: 'Appointment Booked',
      message: `${newBooking.client_name} booked ${newBooking.session_title} (${randomRef}).`,
      type: 'booking',
    })
    return newBooking
  }

  const updateBooking = (id: string, updates: Partial<MockBooking>) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, ...updates } : b))
    persistBookings(updated)
    showNotification(`Booking updated.`)
  }

  const deleteBooking = (id: string) => {
    const target = bookings.find((b) => b.id === id)
    const updated = bookings.filter((b) => b.id !== id)
    persistBookings(updated)
    showNotification(`Booking ${target?.booking_reference || id} cancelled/removed.`)
  }

  const recordDeskPayment = (bookingId: string, paymentMethodNote: string) => {
    const target = bookings.find((b) => b.id === bookingId)
    if (!target) return

    const updated = bookings.map((b) =>
      b.id === bookingId
        ? {
            ...b,
            payment_status: 'paid_in_person' as const,
            payment_method_note: paymentMethodNote,
          }
        : b
    )
    persistBookings(updated)

    // Also update client total spend
    if (target.client_id) {
      const clientUpdated = clients.map((cl) => {
        if (cl.id === target.client_id) {
          return {
            ...cl,
            total_spend: cl.total_spend + target.total_price,
          }
        }
        return cl
      })
      persistClients(clientUpdated)
    }

    showNotification(`Payment of £${target.total_price.toFixed(2)} recorded for ${target.booking_reference}.`)
    addNotification({
      title: 'In-Person Desk Settlement',
      message: `£${target.total_price.toFixed(2)} recorded for ${target.client_name} (${paymentMethodNote}).`,
      type: 'payment',
    })
  }

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES)
    localStorage.removeItem(STORAGE_KEYS.SESSIONS)
    localStorage.removeItem(STORAGE_KEYS.CLIENTS)
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS)
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS)
    setCategories(INITIAL_CATEGORIES)
    setSessions(INITIAL_SESSIONS)
    setClients(INITIAL_CLIENTS)
    setBookings(INITIAL_BOOKINGS)
    setNotifications(INITIAL_NOTIFICATIONS)
    showNotification('All admin mockup data has been reset to defaults.')
  }

  return (
    <AdminStoreContext.Provider
      value={{
        categories,
        sessions,
        clients,
        bookings,
        isHydrated,
        isSidebarCollapsed,
        toggleSidebar,
        notifications,
        unreadCount,
        addNotification,
        markAllNotificationsRead,
        clearNotifications,
        addCategory,
        updateCategory,
        deleteCategory,
        addSession,
        updateSession,
        deleteSession,
        addClient,
        updateClient,
        deleteClient,
        addBooking,
        updateBooking,
        deleteBooking,
        recordDeskPayment,
        resetToDefaults,
        notification,
        showNotification,
      }}
    >
      {/* Toast notification banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-primary text-primary-foreground border border-gold/40 shadow-xl px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}
      {children}
    </AdminStoreContext.Provider>
  )
}

export function useAdminStore() {
  const context = useContext(AdminStoreContext)
  if (!context) {
    throw new Error('useAdminStore must be used within an AdminStoreProvider')
  }
  return context
}
