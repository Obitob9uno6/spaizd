import { Card, CardContent } from "@/components/ui/card"
import { Clock, ShoppingBag, Zap, Users, Crown, Star } from "lucide-react"

export function VIPBenefits() {
  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "Early Access",
      description: "Shop exclusive drops 24-72 hours before public release",
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-secondary" />,
      title: "Member Pricing",
      description: "Save 10-20% on all purchases with exclusive member discounts",
    },
    {
      icon: <Zap className="w-8 h-8 text-secondary" />,
      title: "VIP-Only Drops",
      description: "Access to exclusive colorways and designs never released publicly",
    },
    {
      icon: <Users className="w-8 h-8 text-secondary" />,
      title: "Priority Queue",
      description: "Skip the line on high-demand drops with priority queue access",
    },
    {
      icon: <Crown className="w-8 h-8 text-secondary" />,
      title: "Free Shipping",
      description: "Complimentary shipping on all orders, no minimum required",
    },
    {
      icon: <Star className="w-8 h-8 text-secondary" />,
      title: "Exclusive Community",
      description: "Join our private member community for insider updates and events",
    },
  ]

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">VIP Member Benefits</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock exclusive perks designed for true cannabis streetwear enthusiasts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
