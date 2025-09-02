"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: string
  onComplete?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (!isComplete) {
          setIsComplete(true)
          onComplete?.()
        }
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete, isComplete])

  if (isComplete) {
    return (
      <div className="text-center p-4 bg-secondary/10 rounded-lg">
        <span className="text-secondary font-semibold">Drop is Live!</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div className="bg-card border rounded-lg p-2">
        <div className="text-lg font-bold">{timeLeft.days}</div>
        <div className="text-xs text-muted-foreground">Days</div>
      </div>
      <div className="bg-card border rounded-lg p-2">
        <div className="text-lg font-bold">{timeLeft.hours}</div>
        <div className="text-xs text-muted-foreground">Hours</div>
      </div>
      <div className="bg-card border rounded-lg p-2">
        <div className="text-lg font-bold">{timeLeft.minutes}</div>
        <div className="text-xs text-muted-foreground">Min</div>
      </div>
      <div className="bg-card border rounded-lg p-2">
        <div className="text-lg font-bold">{timeLeft.seconds}</div>
        <div className="text-xs text-muted-foreground">Sec</div>
      </div>
    </div>
  )
}
