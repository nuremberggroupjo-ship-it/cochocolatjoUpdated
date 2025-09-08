import type { OrderAdminData } from "@/types/db"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const AdditionalNotesCard = (
  props: Pick<OrderAdminData, "additionalNotes">,
) => {
  const { additionalNotes } = props
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Additional Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{additionalNotes}</p>
      </CardContent>
    </Card>
  )
}
