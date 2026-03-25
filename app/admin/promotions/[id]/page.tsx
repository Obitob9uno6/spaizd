import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PromotionForm } from "@/components/admin/promotion-form"

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: promotion } = await supabase
    .from("promotions")
    .select("*")
    .eq("id", id)
    .single()

  if (!promotion) notFound()

  return <PromotionForm initialPromotion={promotion} />
}
