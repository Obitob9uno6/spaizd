import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface UsersStatsProps {
  title: string
  value: string
  icon: LucideIcon
  trend: string
  trendUp: boolean
}

export function UsersStats({ title, value, icon: Icon, trend, trendUp }: UsersStatsProps) {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          </div>
          <div className="h-12 w-12 bg-bud-purple/20 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-trichome-frost" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          {trendUp ? (
            <TrendingUp className="h-4 w-4 text-led-green mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-pistil-orange mr-1" />
          )}
          <span className={`text-sm font-medium ${trendUp ? "text-led-green" : "text-pistil-orange"}`}>{trend}</span>
          <span className="text-gray-400 text-sm ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
