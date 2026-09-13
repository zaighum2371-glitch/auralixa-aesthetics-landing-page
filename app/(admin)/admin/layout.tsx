import { AdminStoreProvider } from '@/components/admin/admin-store-provider'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminStoreProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
        {/* Left Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header with User Profile Menu */}
          <AdminHeader />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminStoreProvider>
  )
}
