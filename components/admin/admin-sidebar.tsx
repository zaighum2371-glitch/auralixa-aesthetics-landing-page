'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Users,
  Layers,
  ArrowLeft,
  User,
  ShieldCheck,
  RotateCcw,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'
import { useAdminStore } from './admin-store-provider'

export function AdminSidebar() {
  const pathname = usePathname()
  const { categories, sessions, clients, bookings, resetToDefaults } = useAdminStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
      badge: null,
    },
    {
      name: 'Sessions & Categories',
      href: '/admin/sessions',
      icon: Layers,
      active: pathname.startsWith('/admin/sessions'),
      badge: `${sessions.length} / ${categories.length}`,
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: Calendar,
      active: pathname.startsWith('/admin/bookings'),
      badge: bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length.toString(),
    },
    {
      name: 'Clients',
      href: '/admin/clients',
      icon: Users,
      active: pathname.startsWith('/admin/clients'),
      badge: clients.length.toString(),
    },
  ]

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 group"
          >
            <Sparkles className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-serif text-lg tracking-widest uppercase font-medium block text-foreground">
                Auralixa
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold font-semibold block">
                Executive Admin
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-foreground/60 hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
            Clinic Management
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    item.active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        item.active ? 'text-gold' : 'text-foreground/50 group-hover:text-gold'
                      }`}
                    />
                    <span>{item.name}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        item.active
                          ? 'bg-gold/20 text-gold border border-gold/30'
                          : 'bg-muted text-foreground/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Quick Links Section */}
        <div className="pt-2">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
            Fast Shortcuts
          </div>
          <div className="space-y-1 text-xs">
            <Link
              href="/admin/sessions?action=new-treatment"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-gold" />
              <span>New Treatment</span>
            </Link>
            <Link
              href="/admin/sessions?tab=categories&action=new-category"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-gold" />
              <span>New Category</span>
            </Link>
            <Link
              href="/admin/bookings?action=new"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-gold" />
              <span>New Appointment</span>
            </Link>
            <Link
              href="/admin/clients?action=new"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-gold" />
              <span>Register Client</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info in Sidebar */}
      <div className="pt-6 border-t border-border/60 space-y-3">
        {/* Mock Data Reset */}
        <button
          onClick={() => {
            if (confirm('Reset all admin mockup data (sessions, categories, bookings, clients) to defaults?')) {
              resetToDefaults()
            }
          }}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-foreground/50 hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors"
          title="Reset mockup store to factory data"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-gold" />
            <span>Reset Mock Data</span>
          </span>
          <span className="text-[10px] bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded border border-amber-500/20">
            Mock Mode
          </span>
        </button>

        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 px-3 py-1 text-xs text-foreground/70 hover:text-foreground transition-colors"
        >
          <User className="w-3.5 h-3.5 text-gold" />
          <span>Profile Settings</span>
        </Link>
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 px-3 py-1 text-xs text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch to Client View</span>
        </Link>
        <div className="flex items-center justify-between pt-2 px-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Verified
          </span>
          <SignOutButton />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border/80 p-5 flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        {SidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border/80 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <span className="font-serif text-base tracking-wider uppercase font-medium">
            Auralixa Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-muted/50 text-foreground/80 hover:text-foreground"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-card p-5 h-full z-10 shadow-2xl flex flex-col justify-between overflow-y-auto">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
