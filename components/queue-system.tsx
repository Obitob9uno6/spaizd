"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { Users, Clock, Zap } from "lucide-react"

interface Drop {
  id: string
  name: string
  max_quantity?: number
}

interface User {
  id: string
  email: string
}

interface QueuePosition {
  position: number
  status: string
}

interface QueueSystemProps {
  drop: Drop
  user: User | null
  queuePosition: QueuePosition | null
  dropStatus: "upcoming" | "live" | "ended"
}

export function QueueSystem({ drop, user, queuePosition, dropStatus }: QueueSystemProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(queuePosition)

  const handleJoinQueue = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = "/auth/login"
      return
    }

    setIsJoining(true)
    const supabase = createClient()

    try {
      // Get current queue size to determine position
      const { count } = await supabase
        .from("drop_queue")
        .select("*", { count: "exact", head: true })
        .eq("drop_id", drop.id)

      const position = (count || 0) + 1

      const { error } = await supabase.from("drop_queue").insert({
        drop_id: drop.id,
        user_id: user.id,
        position,
        status: "waiting",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      })

      if (error) throw error

      setCurrentPosition({ position, status: "waiting" })
    } catch (error) {
      console.error("Error joining queue:", error)
    } finally {
      setIsJoining(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Join the Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This is a high-demand drop with limited quantities. Join the queue to secure your spot.
          </p>
          <Button onClick={handleJoinQueue} className="w-full">
            Sign In to Join Queue
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (currentPosition) {
    const progressPercentage = Math.max(0, 100 - (currentPosition.position / 100) * 100)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Queue Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">#{currentPosition.position}</div>
            <p className="text-muted-foreground">Your position in queue</p>
          </div>

          <Progress value={progressPercentage} className="w-full" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Queue Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>

          {currentPosition.status === "waiting" && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {dropStatus === "upcoming" ? "Waiting for drop to start..." : "Waiting for your turn..."}
              </span>
            </div>
          )}

          {currentPosition.status === "active" && (
            <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">
                It's your turn! You have 10 minutes to purchase.
              </span>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Queue positions are updated in real-time. You'll be notified when it's your turn.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          High-Demand Drop
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge variant="destructive">Limited Quantity</Badge>
          <span className="text-sm text-muted-foreground">Only {drop.max_quantity} items available</span>
        </div>

        <p className="text-muted-foreground">
          Due to high demand and limited quantities, this drop uses a queue system to ensure fair access for all
          customers.
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full" />
            <span>Join the queue to secure your spot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full" />
            <span>Get notified when it's your turn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full" />
            <span>10 minutes to complete your purchase</span>
          </div>
        </div>

        <Button onClick={handleJoinQueue} disabled={isJoining} className="w-full">
          {isJoining ? "Joining Queue..." : "Join Queue"}
        </Button>
      </CardContent>
    </Card>
  )
}
