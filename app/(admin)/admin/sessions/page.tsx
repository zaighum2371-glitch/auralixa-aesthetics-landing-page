import { Suspense } from 'react'
import { SessionsManager } from '@/components/admin/sessions-manager'

export const metadata = {
  title: 'Sessions & Categories | Auralixa Aesthetics Admin',
  description: 'Manage clinical treatments catalog and taxonomy categories.',
}

export default function SessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-foreground/50">
          Loading treatments & categories catalog...
        </div>
      }
    >
      <SessionsManager />
    </Suspense>
  )
}
