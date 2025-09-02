import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Clock } from "lucide-react"

interface Drop {
  id: string
  name: string
  status: string
  start_time: string
  end_time: string
  total_quantity: number
  remaining_quantity: number
}

interface DropStatusProps {
  drops: Drop[]
}

export function DropStatus({ drops }: DropStatusProps) {
  if (drops.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No active drops</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {drops.map((drop) => (
        <div key={drop.id} className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">{drop.name}</h4>
            <Badge className="bg-led-green text-black">Active</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Ends {new Date(drop.end_time).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <p className="text-white">
                {drop.remaining_quantity}/{drop.total_quantity} left
              </p>
              <Button asChild variant="ghost" size="sm" className="mt-1">
                <Link href={`/admin/drops/${drop.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
