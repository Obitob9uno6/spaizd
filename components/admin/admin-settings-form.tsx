"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface FeatureFlag {
  id: string
  name: string
  description: string | null
  enabled: boolean
}

interface AdminSettingsFormProps {
  featureFlags: FeatureFlag[]
}

export function AdminSettingsForm({ featureFlags }: AdminSettingsFormProps) {
  const [flags, setFlags] = useState(featureFlags)
  const [saving, setSaving] = useState<string | null>(null)

  const toggleFlag = async (flag: FeatureFlag) => {
    setSaving(flag.id)
    const supabase = createClient()

    const { error } = await supabase
      .from("feature_flags")
      .update({ enabled: !flag.enabled, updated_at: new Date().toISOString() })
      .eq("id", flag.id)

    if (error) {
      toast.error(`Failed to update ${flag.name}`)
    } else {
      setFlags((prev) =>
        prev.map((f) => (f.id === flag.id ? { ...f, enabled: !f.enabled } : f))
      )
      toast.success(`${flag.name} ${!flag.enabled ? "enabled" : "disabled"}`)
    }
    setSaving(null)
  }

  if (flags.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-4">No feature flags configured yet.</p>
    )
  }

  return (
    <div className="space-y-4">
      {flags.map((flag) => (
        <div
          key={flag.id}
          className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-bud-purple/10"
        >
          <div className="space-y-1">
            <Label className="text-trichome-frost font-medium">{flag.name}</Label>
            {flag.description && (
              <p className="text-gray-400 text-xs">{flag.description}</p>
            )}
          </div>
          <Switch
            checked={flag.enabled}
            onCheckedChange={() => toggleFlag(flag)}
            disabled={saving === flag.id}
            aria-label={`Toggle ${flag.name}`}
          />
        </div>
      ))}
    </div>
  )
}
