'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserProfileMenu } from '@/components/user-profile-menu'
import {
  Sparkles,
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  Home,
  CheckCircle2,
  Menu,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react'
import { useAdminStore, NotificationItem } from './admin-store-provider'

export function AdminHeader() {
  const pathname = usePathname()
  const {
    notifications,
    unreadCount,
    markAllNotificationsRead,
    clearNotifications,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    toggleMobileSidebar,
  } = useAdminStore()
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotifOpen])

  // Build Breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const crumbs = [
      { name: 'Console', href: '/admin' },
    ]

    if (pathname === '/admin') {
      crumbs.push({ name: 'Overview', href: '/admin' })
    } else if (pathname.startsWith('/admin/sessions')) {
      crumbs.push({ name: 'Sessions & Categories', href: '/admin/sessions' })
    } else if (pathname.startsWith('/admin/bookings')) {
      crumbs.push({ name: 'Bookings & Desk', href: '/admin/bookings' })
    } else if (pathname.startsWith('/admin/clients')) {
      crumbs.push({ name: 'Clients & Intake', href: '/admin/clients' })
    }

    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-3.5 h-3.5 text-gold" />
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
      case 'client':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
      default:
        return <Sparkles className="w-3.5 h-3.5 text-gold" />
    }
  }

  return (
    <header className="h-16 border-b border-border/70 bg-card/85 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Area: Outside Toggle Icon & Breadcrumbs Navigation */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        {/* Mobile Navigation Toggle (Visible on mobile outside of sidebar) */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-xl border border-border/80 bg-background/90 hover:bg-muted text-foreground hover:text-gold transition-colors flex items-center justify-center shrink-0 shadow-2xs"
          aria-label={isMobileSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          title={isMobileSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <Menu className="w-4 h-4 text-gold" />
        </button>

        {/* Desktop Sidebar Toggle (Visible on desktop outside of sidebar) */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-1.5 rounded-lg border border-border/80 bg-background/80 hover:bg-muted text-foreground/60 hover:text-gold transition-colors items-center justify-center shrink-0 shadow-2xs"
          aria-label={isSidebarCollapsed ? "Expand left sidebar" : "Collapse left sidebar"}
          title={isSidebarCollapsed ? "Expand left sidebar" : "Collapse left sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-gold" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-foreground/60 hover:text-gold" />
          )}
        </button>

        {/* Breadcrumbs Navigation (small text) */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-[11px] text-foreground/50 truncate">
        <Link
          href="/"
          className="hover:text-gold transition-colors flex items-center gap-1"
          title="Return to Public Site"
        >
          <Home className="w-3 h-3 text-gold/70" />
          <span className="hidden sm:inline">Auralixa</span>
        </Link>

        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1
          return (
            <React.Fragment key={crumb.href + idx}>
              <ChevronRight className="w-3 h-3 text-foreground/30 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-foreground tracking-wide">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-gold transition-colors hidden sm:inline"
                >
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          )
        })}
        </nav>
      </div>

      {/* Right Controls: Notification Center + User Profile */}
      <div className="flex items-center gap-3">
        {/* Real-time Notification Center Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-full border border-border/80 hover:border-gold hover:bg-muted/40 text-foreground/70 hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-gold/40"
            aria-label="Activity and notifications"
            aria-expanded={isNotifOpen}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-primary font-serif font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-card shadow-xs animate-in zoom-in-50">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border/90 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              {/* Header */}
              <div className="px-4 pb-3 border-b border-border/60 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm font-semibold text-foreground">
                    Activity & Notifications
                  </h3>
                  <p className="text-[10px] text-foreground/50">
                    Real-time clinic events and operational updates
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-gold hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Feed */}
              <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-foreground/40">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 transition-colors flex items-start gap-3 hover:bg-muted/30 ${
                        !n.isRead ? 'bg-gold/5' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-card border border-border/80 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-foreground/40 font-mono">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/70 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-foreground/40 font-mono text-[10px]">
                    {notifications.length} alerts logged
                  </span>
                  <button
                    onClick={clearNotifications}
                    className="text-foreground/50 hover:text-destructive flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear feed</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Menu with Avatar & Name */}
        <UserProfileMenu showName={true} />
      </div>
    </header>
  )
}
