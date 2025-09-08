"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { Shield, AlertTriangle, FileText, Activity, Globe, Calendar, CheckCircle, Clock, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AuditLog {
  id: string
  action: string
  resource_type: string
  resource_id: string
  user_profiles: { email: string; full_name?: string }
  ip_address: string
  created_at: string
}

interface ComplianceAlert {
  id: string
  alert_type: string
  severity: string
  title: string
  description: string
  is_resolved: boolean
  created_at: string
}

interface ComplianceDocument {
  id: string
  document_type: string
  title: string
  description: string
  expiry_date: string
  status: string
  created_at: string
}

export default function AdminCompliancePage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([])
  const [documents, setDocuments] = useState<ComplianceDocument[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadComplianceData = async () => {
    try {
      setLoading(true)
      const [auditResponse, alertsResponse, documentsResponse] = await Promise.all([
        fetch("/api/admin/compliance/audit-logs?limit=20"),
        fetch("/api/admin/compliance/alerts"),
        fetch("/api/admin/compliance/documents"),
      ])

      if (!auditResponse.ok || !alertsResponse.ok || !documentsResponse.ok) {
        throw new Error("Failed to load compliance data")
      }

      const [auditData, alertsData, documentsData] = await Promise.all([
        auditResponse.json(),
        alertsResponse.json(),
        documentsResponse.json(),
      ])

      setAuditLogs(auditData.logs || [])
      setAlerts(alertsData.alerts || [])
      setDocuments(documentsData.documents || [])
    } catch (error) {
      console.error("Error loading compliance data:", error)
      toast({
        title: "Error",
        description: "Failed to load compliance data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplianceData()
  }, [])

  const unresolvedAlerts = alerts.filter((alert) => !alert.is_resolved)
  const criticalAlerts = unresolvedAlerts.filter((alert) => alert.severity === "critical")
  const expiringDocuments = documents.filter((doc) => {
    const expiryDate = new Date(doc.expiry_date)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate <= thirtyDaysFromNow && doc.status === "active"
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400"
      case "high":
        return "bg-orange-500/20 text-orange-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "low":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-leaf-green/20 text-leaf-green"
      case "expired":
        return "bg-red-500/20 text-red-400"
      case "pending_renewal":
        return "bg-amber-glow/20 text-amber-glow"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-trichome-frost">Compliance Management</h1>
          <p className="text-gray-400 mt-2">Loading compliance data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-trichome-frost">Compliance Management</h1>
          <p className="text-gray-400 mt-2">Cannabis business regulatory oversight and compliance monitoring</p>
        </div>
        <Badge className="bg-amber-glow/20 text-amber-glow">
          <Shield className="h-4 w-4 mr-1" />
          Owner Only
        </Badge>
      </div>

      {/* Compliance Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Active Alerts"
          value={unresolvedAlerts.length.toString()}
          icon={AlertTriangle}
          trend={criticalAlerts.length > 0 ? `${criticalAlerts.length} critical` : "All resolved"}
          trendUp={criticalAlerts.length === 0}
        />
        <AdminStatsCard
          title="Compliance Documents"
          value={documents.length.toString()}
          icon={FileText}
          trend={`${expiringDocuments.length} expiring soon`}
          trendUp={expiringDocuments.length === 0}
        />
        <AdminStatsCard
          title="Audit Entries"
          value={auditLogs.length.toString()}
          icon={Activity}
          trend="Last 20 shown"
          trendUp={true}
        />
        <AdminStatsCard title="Geographic Rules" value="16" icon={Globe} trend="US States Covered" trendUp={true} />
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <div>
                <h3 className="text-red-400 font-semibold">Critical Compliance Alerts</h3>
                <p className="text-red-300 text-sm">
                  {criticalAlerts.length} critical alert{criticalAlerts.length !== 1 ? "s" : ""} require immediate
                  attention
                </p>
              </div>
              <Button
                variant="outline"
                className="ml-auto border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-cosmic-black/50 border-bud-purple/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-bud-purple">
            Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-bud-purple">
            Alerts ({unresolvedAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-bud-purple">
            Documents
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-bud-purple">
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card className="bg-cosmic-black border-bud-purple/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-glow" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-cosmic-black/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <span className="text-sm text-gray-400">{alert.alert_type}</span>
                        </div>
                        <p className="text-trichome-frost font-medium">{alert.title}</p>
                        <p className="text-gray-400 text-sm">{alert.description}</p>
                      </div>
                      {alert.is_resolved ? (
                        <CheckCircle className="h-5 w-5 text-leaf-green" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-glow" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Status */}
            <Card className="bg-cosmic-black border-bud-purple/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost flex items-center gap-2">
                  <FileText className="h-5 w-5 text-leaf-green" />
                  Document Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.slice(0, 5).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-cosmic-black/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                          <span className="text-sm text-gray-400">{doc.document_type}</span>
                        </div>
                        <p className="text-trichome-frost font-medium">{doc.title}</p>
                        <p className="text-gray-400 text-sm">
                          Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Calendar className="h-5 w-5 text-bud-purple" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-cosmic-black border-bud-purple/30">
            <CardHeader>
              <CardTitle className="text-trichome-frost">Compliance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between p-4 bg-cosmic-black/50 rounded-lg border border-bud-purple/20"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        <Badge variant="outline" className="text-gray-400">
                          {alert.alert_type}
                        </Badge>
                        {alert.is_resolved ? (
                          <Badge className="bg-leaf-green/20 text-leaf-green">Resolved</Badge>
                        ) : (
                          <Badge className="bg-amber-glow/20 text-amber-glow">Active</Badge>
                        )}
                      </div>
                      <h3 className="text-trichome-frost font-semibold mb-1">{alert.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{alert.description}</p>
                      <p className="text-xs text-gray-500">Created: {new Date(alert.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.is_resolved ? (
                        <CheckCircle className="h-5 w-5 text-leaf-green" />
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-bud-purple/50 text-bud-purple bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="bg-cosmic-black border-bud-purple/30">
            <CardHeader>
              <CardTitle className="text-trichome-frost">Compliance Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-bud-purple/30">
                      <th className="text-left py-3 px-4 text-trichome-frost">Document</th>
                      <th className="text-left py-3 px-4 text-trichome-frost">Type</th>
                      <th className="text-left py-3 px-4 text-trichome-frost">Status</th>
                      <th className="text-left py-3 px-4 text-trichome-frost">Expiry Date</th>
                      <th className="text-left py-3 px-4 text-trichome-frost">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-bud-purple/20">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-trichome-frost font-medium">{doc.title}</p>
                            <p className="text-gray-400 text-sm">{doc.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-gray-400 capitalize">
                            {doc.document_type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{new Date(doc.expiry_date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-bud-purple hover:bg-bud-purple/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="bg-cosmic-black border-bud-purple/30">
            <CardHeader>
              <CardTitle className="text-trichome-frost">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-cosmic-black/50 rounded-lg border border-bud-purple/20"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-leaf-green" />
                      <div>
                        <p className="text-trichome-frost text-sm">
                          <span className="font-medium">{log.user_profiles?.email}</span> performed{" "}
                          <span className="text-amber-glow">{log.action}</span> on{" "}
                          <span className="text-bud-purple">{log.resource_type}</span>
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(log.created_at).toLocaleString()} • IP: {log.ip_address}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-cosmic-black/50">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
