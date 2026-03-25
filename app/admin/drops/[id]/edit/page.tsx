import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { DropForm } from "@/components/admin/drop-form"

export default async function EditDropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: drop } = await supabase
    .from("drops")
    .select(`
      *,
      drop_products (*)
    `)
    .eq("id", id)
    .single()

  if (!drop) notFound()

  return <DropForm initialDrop={drop} />
}
