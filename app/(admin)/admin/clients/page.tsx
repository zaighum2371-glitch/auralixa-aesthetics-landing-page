import { Suspense } from 'react'
import { ClientsManager } from '@/components/admin/clients-manager'

export const metadata = {
  title: 'Clients & Medical Intake | Auralixa Aesthetics Admin',
  description: 'Manage clinic client directory, medical intake contraindications, and appointment history.',
}

export default function ClientsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-foreground/50">
          Loading client directory...
        </div>
      }
    >
      <ClientsManager />
    </Suspense>
  )
}
