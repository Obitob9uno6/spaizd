"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, Users, Zap, Crown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"

interface AnalyticsData {
  summary: {
    totalRevenue: number
    totalOrders: number
    avgOrderValue: number
    conversionRate: number
  }
  charts: {
    revenueByDay: Array<{ date: string; value: number }>
    ordersByDay: Array<{ date: string; value: number }>
    ordersByStatus: Array<{ status: string; count: number; percentage: number }>
    productPerformance: Array<{ name: string; totalSold: number; totalRevenue: number }>
    topSellingProducts: Array<{ name: string; quantity: number; revenue: number }>
    dropPerformance: Array<{ name: string; sellThroughRate: number; totalSold: number }>
    userGrowthData: Array<{ date: string; value: number }>
    vipMetrics: {
      tierDistribution: Array<{ tier: string; count: number }>
      totalRevenue: number
      totalMembers: number
    }
  }
}

const COLORS = {
  primary: "#8B5CF6", // bud-purple
  secondary: "#10B981", // leaf-green
  accent: "#F59E0B", // amber-glow
  danger: "#EF4444", // pistil-orange
  info: "#3B82F6",
  success: "#059669",
}

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger, COLORS.info, COLORS.success]

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30d")
  const { toast } = useToast()

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      if (!response.ok) throw new Error("Failed to load analytics")

      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Error loading analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [period])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-trichome-frost">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-2">Loading analytics data...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: COLORS.primary,
    },
    orders: {
      label: "Orders",
      color: COLORS.secondary,
    },
    users: {
      label: "Users",
      color: COLORS.accent,
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-trichome-frost">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-2">Comprehensive business insights and performance metrics</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-black border-bud-purple/30">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Total Revenue"
          value={`$${data.summary.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend="+12.5%"
          trendUp={true}
        />
        <AdminStatsCard
          title="Total Orders"
          value={data.summary.totalOrders.toString()}
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp={true}
        />
        <AdminStatsCard
          title="Avg Order Value"
          value={`$${data.summary.avgOrderValue.toFixed(2)}`}
          icon={TrendingUp}
          trend="+5.1%"
          trendUp={true}
        />
        <AdminStatsCard
          title="Conversion Rate"
          value={`${data.summary.conversionRate}%`}
          icon={Users}
          trend="+2.3%"
          trendUp={true}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-leaf-green" />
              Revenue Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={data.charts.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.primary }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Orders Over Time */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-leaf-green" />
              Orders Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={data.charts.ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.secondary }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-leaf-green" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={data.charts.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.charts.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <Zap className="h-5 w-5 text-leaf-green" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={data.charts.topSellingProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantity" fill={COLORS.accent} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <Users className="h-5 w-5 text-leaf-green" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={data.charts.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.info}
                  strokeWidth={2}
                  dot={{ fill: COLORS.info }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* VIP Tier Distribution */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-glow" />
              VIP Membership Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-trichome-frost">{data.charts.vipMetrics.totalMembers}</div>
                <div className="text-sm text-gray-400">Total VIP Members</div>
                <div className="text-lg font-semibold text-amber-glow mt-2">
                  ${data.charts.vipMetrics.totalRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">VIP Revenue</div>
              </div>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <PieChart>
                  <Pie
                    data={data.charts.vipMetrics.tierDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tier, count }) => `${tier}: ${count}`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.charts.vipMetrics.tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drop Performance Table */}
      {data.charts.dropPerformance.length > 0 && (
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost flex items-center gap-2">
              <Zap className="h-5 w-5 text-leaf-green" />
              Drop Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bud-purple/30">
                    <th className="text-left py-3 px-4 text-trichome-frost">Drop Name</th>
                    <th className="text-left py-3 px-4 text-trichome-frost">Items Sold</th>
                    <th className="text-left py-3 px-4 text-trichome-frost">Sell-through Rate</th>
                    <th className="text-left py-3 px-4 text-trichome-frost">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.charts.dropPerformance.map((drop, index) => (
                    <tr key={index} className="border-b border-bud-purple/20">
                      <td className="py-3 px-4 text-gray-300">{drop.name}</td>
                      <td className="py-3 px-4 text-gray-300">{drop.totalSold}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-cosmic-black/50 rounded-full h-2">
                            <div
                              className="bg-leaf-green h-2 rounded-full"
                              style={{ width: `${Math.min(drop.sellThroughRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-300 text-sm">{drop.sellThroughRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            drop.sellThroughRate >= 80
                              ? "bg-leaf-green/20 text-leaf-green"
                              : drop.sellThroughRate >= 50
                                ? "bg-amber-glow/20 text-amber-glow"
                                : "bg-pistil-orange/20 text-pistil-orange"
                          }`}
                        >
                          {drop.sellThroughRate >= 80
                            ? "Excellent"
                            : drop.sellThroughRate >= 50
                              ? "Good"
                              : "Needs Attention"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
