'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface RoleManagerProps {
  userId: string
  currentRole: 'user' | 'client' | 'admin'
  onUpdateRole: (userId: string, newRole: 'user' | 'client' | 'admin') => Promise<void>
}

export function RoleManager({ userId, currentRole, onUpdateRole }: RoleManagerProps) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'user' | 'client' | 'admin'
    if (newRole === currentRole) return

    setLoading(true)
    try {
      await onUpdateRole(userId, newRole)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />}
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={loading}
        className="text-xs bg-background border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
      >
        <option value="user">Member (user)</option>
        <option value="client">Client (client)</option>
        <option value="admin">Administrator (admin)</option>
      </select>
    </div>
  )
}
