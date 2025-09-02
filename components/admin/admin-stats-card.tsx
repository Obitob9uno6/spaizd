import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface AdminStatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function AdminStatsCard({ title, value, icon: Icon, trend, trendUp }: AdminStatsCardProps) {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-led-green" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            {trendUp ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={trendUp ? "text-green-500" : "text-red-500"}>{trend}</span>
            <span>from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
