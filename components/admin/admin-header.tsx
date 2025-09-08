"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { LogOut, Bell, Shield, Crown } from "lucide-react"

interface AdminHeaderProps {
  userProfile: {
    role: string
    email: string
    full_name?: string
  }
  isOwner: boolean
}

export function AdminHeader({ userProfile, isOwner }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="h-16 bg-cosmic-black border-b border-bud-purple/30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-trichome-frost">Admin Dashboard</h2>
        {isOwner && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-glow/20 rounded-full">
            <Crown className="h-4 w-4 text-amber-glow" />
            <span className="text-xs text-amber-glow font-medium">Owner</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-trichome-frost">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Shield className="h-4 w-4" />
          <span className="capitalize">{userProfile.role}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-300 hover:text-pistil-orange">
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}
