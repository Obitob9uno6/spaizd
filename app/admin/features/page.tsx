"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Flag, Plus, Edit, Users, Globe, Shield, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FeatureFlag {
  id: string
  name: string
  key: string
  description: string
  is_enabled: boolean
  rollout_percentage: number
  target_audience: string
  environment: string
  created_at: string
  updated_at: string
}

export default function AdminFeaturesPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [environment, setEnvironment] = useState("production")
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadFlags = async () => {
    try {
      const response = await fetch(`/api/admin/feature-flags?environment=${environment}`)
      if (!response.ok) throw new Error("Failed to load feature flags")

      const data = await response.json()
      setFlags(data.flags || [])
    } catch (error) {
      console.error("Error loading flags:", error)
      toast({
        title: "Error",
        description: "Failed to load feature flags",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFlags()
  }, [environment])

  const toggleFlag = async (flag: FeatureFlag) => {
    try {
      const response = await fetch(`/api/admin/feature-flags/${flag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_enabled: !flag.is_enabled }),
      })

      if (!response.ok) throw new Error("Failed to update flag")

      const data = await response.json()
      setFlags((prev) => prev.map((f) => (f.id === flag.id ? data.flag : f)))

      toast({
        title: "Success",
        description: `${flag.name} ${!flag.is_enabled ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      console.error("Toggle error:", error)
      toast({
        title: "Error",
        description: "Failed to update feature flag",
        variant: "destructive",
      })
    }
  }

  const updateRollout = async (flag: FeatureFlag, percentage: number) => {
    try {
      const response = await fetch(`/api/admin/feature-flags/${flag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollout_percentage: percentage }),
      })

      if (!response.ok) throw new Error("Failed to update rollout")

      const data = await response.json()
      setFlags((prev) => prev.map((f) => (f.id === flag.id ? data.flag : f)))

      toast({
        title: "Success",
        description: `Rollout updated to ${percentage}%`,
      })
    } catch (error) {
      console.error("Rollout error:", error)
      toast({
        title: "Error",
        description: "Failed to update rollout percentage",
        variant: "destructive",
      })
    }
  }

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case "vip":
        return <Shield className="h-4 w-4" />
      case "admin":
        return <Users className="h-4 w-4" />
      case "beta":
        return <Zap className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case "vip":
        return "bg-amber-glow/20 text-amber-glow"
      case "admin":
        return "bg-bud-purple/20 text-bud-purple"
      case "beta":
        return "bg-leaf-green/20 text-leaf-green"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-trichome-frost">Feature Flags</h1>
          <p className="text-gray-400 mt-2">Manage application features and rollouts</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-48 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-cosmic-black border-bud-purple/30">
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-leaf-green hover:bg-leaf-green/80 text-cosmic-black">
                <Plus className="h-4 w-4 mr-2" />
                New Flag
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cosmic-black border-bud-purple/30 text-trichome-frost">
              <DialogHeader>
                <DialogTitle>Create Feature Flag</DialogTitle>
              </DialogHeader>
              <CreateFlagForm
                onSuccess={() => {
                  setIsCreateDialogOpen(false)
                  loadFlags()
                }}
                environment={environment}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Feature Flags Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading feature flags...</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {flags.map((flag) => (
            <Card key={flag.id} className="bg-cosmic-black border-bud-purple/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flag className="h-5 w-5 text-leaf-green" />
                    <div>
                      <CardTitle className="text-trichome-frost">{flag.name}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        Key: <code className="bg-cosmic-black/50 px-1 rounded">{flag.key}</code>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getAudienceColor(flag.target_audience)}>
                      {getAudienceIcon(flag.target_audience)}
                      <span className="ml-1 capitalize">{flag.target_audience}</span>
                    </Badge>
                    <Switch checked={flag.is_enabled} onCheckedChange={() => toggleFlag(flag)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{flag.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <Label className="text-sm text-gray-400">Rollout Percentage</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={flag.rollout_percentage}
                          onChange={(e) => updateRollout(flag, Number.parseInt(e.target.value) || 0)}
                          className="w-20 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                        />
                        <span className="text-sm text-gray-400">%</span>
                      </div>
                    </div>

                    <div className="w-32">
                      <div className="bg-cosmic-black/50 rounded-full h-2">
                        <div
                          className="bg-leaf-green h-2 rounded-full transition-all"
                          style={{ width: `${flag.rollout_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingFlag(flag)}
                      className="text-bud-purple hover:bg-bud-purple/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingFlag} onOpenChange={() => setEditingFlag(null)}>
        <DialogContent className="bg-cosmic-black border-bud-purple/30 text-trichome-frost">
          <DialogHeader>
            <DialogTitle>Edit Feature Flag</DialogTitle>
          </DialogHeader>
          {editingFlag && (
            <EditFlagForm
              flag={editingFlag}
              onSuccess={() => {
                setEditingFlag(null)
                loadFlags()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateFlagForm({ onSuccess, environment }: { onSuccess: () => void; environment: string }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    target_audience: "all",
    environment: environment,
    is_enabled: false,
    rollout_percentage: 0,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create flag")

      toast({
        title: "Success",
        description: "Feature flag created successfully",
      })
      onSuccess()
    } catch (error) {
      console.error("Create error:", error)
      toast({
        title: "Error",
        description: "Failed to create feature flag",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
        />
      </div>

      <div>
        <Label htmlFor="audience">Target Audience</Label>
        <Select
          value={formData.target_audience}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, target_audience: value }))}
        >
          <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-black border-bud-purple/30">
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="vip">VIP Members</SelectItem>
            <SelectItem value="admin">Admin Users</SelectItem>
            <SelectItem value="beta">Beta Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full bg-leaf-green hover:bg-leaf-green/80 text-cosmic-black">
        Create Feature Flag
      </Button>
    </form>
  )
}

function EditFlagForm({ flag, onSuccess }: { flag: FeatureFlag; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: flag.name,
    description: flag.description,
    target_audience: flag.target_audience,
    is_enabled: flag.is_enabled,
    rollout_percentage: flag.rollout_percentage,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/admin/feature-flags/${flag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update flag")

      toast({
        title: "Success",
        description: "Feature flag updated successfully",
      })
      onSuccess()
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update feature flag",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Name</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
        />
      </div>

      <div>
        <Label htmlFor="edit-audience">Target Audience</Label>
        <Select
          value={formData.target_audience}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, target_audience: value }))}
        >
          <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-black border-bud-purple/30">
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="vip">VIP Members</SelectItem>
            <SelectItem value="admin">Admin Users</SelectItem>
            <SelectItem value="beta">Beta Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full bg-leaf-green hover:bg-leaf-green/80 text-cosmic-black">
        Update Feature Flag
      </Button>
    </form>
  )
}
