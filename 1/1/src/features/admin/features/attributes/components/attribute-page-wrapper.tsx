import { getAttributeBySlugAdmin } from "@/data"
import { AttributeForm } from "@/features/admin/features/attributes/components/attribute-form"
import { SaveAttributeSchema } from "@/features/admin/features/attributes/lib/attribute.schema"

interface AttributePageWrapperProps {
  // Accept plain object with slug
  params: { slug: string }
}

/**
 * Server Component — async
 * Fetches attribute by slug and passes it to AttributeForm
 */
export const AttributePageWrapper = async ({
  params,
}: AttributePageWrapperProps) => {
  const { slug } = params
  const attribute = await getAttributeBySlugAdmin(slug)

  const defaultValues: SaveAttributeSchema = {
    name: attribute?.name ?? "",
    slug: attribute?.slug ?? "",
    image: attribute?.image ?? "",
    description: attribute?.description ?? "",
    id: attribute?.id,
  }

  const isEditing = !!attribute

  return <AttributeForm defaultValues={defaultValues} isEditing={isEditing} />
}
