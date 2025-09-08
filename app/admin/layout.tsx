import type React from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?admin=true")
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("role, email, full_name")
    .eq("id", user.id)
    .single()

  if (error || !profile || profile.role !== "admin") {
    // Log unauthorized access attempt
    console.log(`[SECURITY] Unauthorized admin access attempt by user: ${user.email}`)
    redirect("/?error=unauthorized")
  }

  const isOwner = profile.email === process.env.OWNER_EMAIL || profile.role === "owner"

  return (
    <div className="min-h-screen bg-cosmic-black">
      <AdminSidebar userProfile={profile} isOwner={isOwner} />
      <div className="lg:pl-64">
        <AdminHeader userProfile={profile} isOwner={isOwner} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
