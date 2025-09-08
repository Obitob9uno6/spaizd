"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search, MoreHorizontal, Crown, Shield, User, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  display_name?: string
  phone?: string
  created_at: string
  role: string
  vip_memberships?: Array<{
    status: string
    expires_at: string
    vip_tiers: {
      name: string
      discount_percent: number
    }
  }>
  orders?: Array<{
    id: string
    total_cents: number
    status: string
    created_at: string
  }>
}

interface UsersTableProps {
  users: UserProfile[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [vipFilter, setVipFilter] = useState("all")
  const supabase = createClientComponentClient()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-amber-glow text-black"
      case "admin":
        return "bg-bud-purple text-white"
      case "customer":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return Crown
      case "admin":
        return Shield
      default:
        return User
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: userId,
        role: newRole,
      })

      if (error) throw error

      // Refresh the page to show updated role
      window.location.reload()
    } catch (error) {
      console.error("Error updating user role:", error)
      alert("Failed to update user role")
    }
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim()
    const displayName = user.display_name || fullName || "No name"

    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    const hasActiveVip = user.vip_memberships?.some((membership) => membership.status === "active")
    const matchesVip =
      vipFilter === "all" || (vipFilter === "vip" && hasActiveVip) || (vipFilter === "regular" && !hasActiveVip)

    return matchesSearch && matchesRole && matchesVip
  })

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users, emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
            </SelectContent>
          </Select>
          <Select value={vipFilter} onValueChange={setVipFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="VIP Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="vip">VIP Members</SelectItem>
              <SelectItem value="regular">Regular Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">VIP Status</TableHead>
              <TableHead className="text-gray-300">Orders</TableHead>
              <TableHead className="text-gray-300">Total Spent</TableHead>
              <TableHead className="text-gray-300">Joined</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim()
              const displayName = user.display_name || fullName || "No name"
              const RoleIcon = getRoleIcon(user.role)
              const activeVip = user.vip_memberships?.find((membership) => membership.status === "active")
              const totalSpent = user.orders?.reduce((sum, order) => sum + order.total_cents, 0) || 0
              const orderCount = user.orders?.length || 0

              return (
                <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{displayName}</div>
                        <div className="text-sm text-gray-400">ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {activeVip ? (
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-glow" />
                        <div>
                          <div className="text-amber-glow font-medium">{activeVip.vip_tiers.name}</div>
                          <div className="text-xs text-gray-400">
                            Expires {new Date(activeVip.expires_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Regular</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">{orderCount}</TableCell>
                  <TableCell className="text-white font-medium">${(totalSpent / 100).toFixed(2)}</TableCell>
                  <TableCell className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/users/${user.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateUserRole(user.id, "customer")}>
                            Set as Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(user.id, "admin")}>
                            Set as Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(user.id, "owner")}>
                            Set as Owner
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No users found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
