"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Shield, Lock, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const attempts = localStorage.getItem("admin_login_attempts")
    if (attempts) {
      setLoginAttempts(Number.parseInt(attempts))
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loginAttempts >= 5) {
      setError("Too many failed attempts. Please try again later.")
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role, email")
        .eq("id", data.user.id)
        .single()

      if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
        await supabase.auth.signOut()
        throw new Error("Access denied. Admin privileges required.")
      }

      // Clear login attempts on success
      localStorage.removeItem("admin_login_attempts")
      router.push("/admin")
    } catch (error: unknown) {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      localStorage.setItem("admin_login_attempts", newAttempts.toString())

      setError(error instanceof Error ? error.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cosmic-black">
      <div className="absolute inset-0 bg-gradient-to-br from-bud-purple/20 via-cosmic-black to-leaf-green/10" />
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-cosmic-black/90 border-bud-purple/30 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-bud-purple/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-trichome-frost" />
            </div>
            <CardTitle className="text-2xl text-trichome-frost">Admin Access</CardTitle>
            <CardDescription className="text-gray-400">Secure login for Spaizd brand management</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-trichome-frost">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@spaizd.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                  disabled={loginAttempts >= 5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-trichome-frost">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost pr-10"
                    disabled={loginAttempts >= 5}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-trichome-frost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-pistil-orange bg-pistil-orange/10 p-3 rounded-md border border-pistil-orange/20">
                  <Lock className="w-4 h-4 inline mr-2" />
                  {error}
                </div>
              )}

              {loginAttempts > 0 && loginAttempts < 5 && (
                <div className="text-sm text-amber-glow">Warning: {loginAttempts}/5 failed attempts</div>
              )}

              <Button
                type="submit"
                className="w-full bg-bud-purple hover:bg-bud-purple/80 text-white"
                disabled={isLoading || loginAttempts >= 5}
              >
                {isLoading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              <Lock className="w-4 h-4 inline mr-1" />
              Secure access for authorized personnel only
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
