"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Shield, Crown, User } from "lucide-react"

interface UserRoleUpdaterProps {
  userId: string
  currentRole: string
}

export function UserRoleUpdater({ userId, currentRole }: UserRoleUpdaterProps) {
  const [role, setRole] = useState(currentRole)
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleUpdateRole = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: userId,
        role: role,
      })

      if (error) throw error

      router.refresh()
      alert("User role updated successfully!")
    } catch (error) {
      console.error("Error updating user role:", error)
      alert("Failed to update user role")
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-amber-glow" />
      case "admin":
        return <Shield className="h-4 w-4 text-bud-purple" />
      default:
        return <User className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="role" className="text-gray-300">
          User Role
        </Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </div>
            </SelectItem>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </div>
            </SelectItem>
            <SelectItem value="owner">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Owner
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {getRoleIcon(role)}
          <span className="text-white font-medium capitalize">{role}</span>
        </div>
        <p className="text-gray-400 text-sm">
          {role === "owner" && "Full system access with all administrative privileges"}
          {role === "admin" && "Administrative access to manage users, orders, and products"}
          {role === "customer" && "Standard customer access with shopping and account features"}
        </p>
      </div>

      <Button
        onClick={handleUpdateRole}
        disabled={loading || role === currentRole}
        className="w-full bg-bud-purple hover:bg-bud-purple/80"
      >
        {loading ? "Updating..." : "Update Role"}
      </Button>
    </div>
  )
}
