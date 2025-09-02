"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { LogOut, Bell } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white">Admin Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-300 hover:text-white">
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}
