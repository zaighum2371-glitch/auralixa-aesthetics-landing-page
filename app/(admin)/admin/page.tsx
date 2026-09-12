import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Users, Calendar, Sparkles, PoundSterling, Shield, UserCheck, ShieldAlert } from 'lucide-react'
import { RoleManager } from '@/components/admin/role-manager'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const userList = profiles || []
  const totalUsers = userList.length
  const totalAdmins = userList.filter((p) => p.role === 'admin').length
  const totalClients = userList.filter((p) => p.role === 'client').length
  const standardMembers = userList.filter((p) => p.role === 'user').length

  // Server Action to update user role for testing
  async function updateUserRole(userId: string, newRole: 'user' | 'client' | 'admin') {
    'use server'
    const adminSupabase = await createClient()
    await adminSupabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    revalidatePath('/admin')
    revalidatePath('/dashboard')
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div>
        <span className="text-xs uppercase tracking-widest text-gold font-semibold">
          Clinical Operations
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mt-1">
          Executive Dashboard
        </h1>
        <p className="text-sm text-foreground/70 mt-1">
          Monitor registered clinic profiles, enforce role permissions, and oversee clinic operations.
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-foreground/50">
            <span className="text-xs font-medium uppercase tracking-wider">Total Profiles</span>
            <Users className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-serif font-medium text-foreground">{totalUsers}</div>
          <p className="text-xs text-foreground/60">{standardMembers} standard members</p>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-foreground/50">
            <span className="text-xs font-medium uppercase tracking-wider">Active Clients</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-medium text-foreground">{totalClients}</div>
          <p className="text-xs text-foreground/60">With completed booking history</p>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-foreground/50">
            <span className="text-xs font-medium uppercase tracking-wider">Administrators</span>
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-serif font-medium text-foreground">{totalAdmins}</div>
          <p className="text-xs text-foreground/60">Privileged clinic staff</p>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-foreground/50">
            <span className="text-xs font-medium uppercase tracking-wider">In-Person Revenue</span>
            <PoundSterling className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-serif font-medium text-foreground">£0.00</div>
          <p className="text-xs text-foreground/60">Phase 8 In-Person Desk</p>
        </div>
      </div>

      {/* Role Management & User Directory Table */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-foreground">
              User Profiles & Role Rules Testing
            </h2>
            <p className="text-xs text-foreground/60">
              Live records from the Supabase <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">public.profiles</code> table. You can modify any user&apos;s role below to test role switching.
            </p>
          </div>
          <span className="text-xs font-medium text-foreground/50 self-start sm:self-auto">
            {totalUsers} Registered
          </span>
        </div>

        {userList.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ShieldAlert className="w-8 h-8 text-foreground/30 mx-auto" />
            <p className="text-sm text-foreground/70">
              No profiles found in the database yet.
            </p>
            <p className="text-xs text-foreground/50 max-w-md mx-auto">
              Create a new user account through <a href="/signup" className="text-gold underline underline-offset-4">Sign Up</a> or provision an admin account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                  <th className="py-3 px-3">Name / User</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Current Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Role Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {userList.map((userProfile) => (
                  <tr key={userProfile.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-foreground">
                      {userProfile.first_name || userProfile.last_name
                        ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                        : 'Unnamed User'}
                    </td>
                    <td className="py-3 px-3 text-foreground/80 font-mono text-xs">
                      {userProfile.email}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        userProfile.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-700 border-purple-500/20'
                          : userProfile.role === 'client'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                      }`}>
                        {userProfile.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                        {userProfile.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <RoleManager
                        userId={userProfile.id}
                        currentRole={userProfile.role}
                        onUpdateRole={updateUserRole}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
