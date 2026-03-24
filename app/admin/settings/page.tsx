import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Store, Shield, Bell, Globe, Database } from "lucide-react"
import { AdminSettingsForm } from "@/components/admin/admin-settings-form"

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/admin-login")

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, email, full_name")
    .eq("id", user.id)
    .single()

  // Only owners can access settings
  if (!profile || profile.role !== "owner") {
    redirect("/admin?error=owner_required")
  }

  // Fetch feature flags
  const { data: featureFlags } = await supabase.from("feature_flags").select("*").order("name", { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-trichome-frost flex items-center gap-3">
          <Settings className="h-8 w-8 text-bud-purple" />
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Configure your Spaizd store settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Info */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <Store className="h-5 w-5 text-leaf-green" />
              Store Information
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your store's public-facing details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Store Name</p>
                <p className="text-trichome-frost font-medium">Spaizd</p>
              </div>
              <div>
                <p className="text-gray-400">Store Status</p>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30 mt-1">Live</Badge>
              </div>
              <div>
                <p className="text-gray-400">Owner Email</p>
                <p className="text-trichome-frost font-medium truncate">{profile.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Account Role</p>
                <Badge className="bg-amber-glow/20 text-amber-glow border-amber-glow/30 mt-1 capitalize">
                  {profile.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <Shield className="h-5 w-5 text-bud-purple" />
              Security
            </CardTitle>
            <CardDescription className="text-gray-400">
              Authentication and access control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Row Level Security (RLS)</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Admin Login Lockout</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">Active (5 attempts)</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">OAuth Providers</span>
                <span className="text-trichome-frost">Google, Facebook</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email Verification</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">Required</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-glow" />
              Notifications
            </CardTitle>
            <CardDescription className="text-gray-400">
              Admin alert preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">New Order Alerts</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">On</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Low Stock Warnings</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">On</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">New VIP Sign-ups</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">On</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Failed Payments</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">On</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <Database className="h-5 w-5 text-pistil-orange" />
              Database
            </CardTitle>
            <CardDescription className="text-gray-400">
              Supabase connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Provider</span>
                <span className="text-trichome-frost">Supabase</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Connection</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Auth</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Realtime</span>
                <Badge className="bg-leaf-green/20 text-leaf-green border-leaf-green/30">Enabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Flags */}
      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost flex items-center gap-2">
            <Globe className="h-5 w-5 text-bud-purple" />
            Feature Flags
          </CardTitle>
          <CardDescription className="text-gray-400">
            Toggle features on or off for all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminSettingsForm featureFlags={featureFlags || []} />
        </CardContent>
      </Card>
    </div>
  )
}
