interface InfoFieldProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

export const PlaceOrderInfoField = ({
  icon: Icon,
  label,
  value,
}: InfoFieldProps) => {
  return (
    <div className="flex items-center gap-3">
      <Icon className="text-primary size-4 flex-shrink-0" />
      <div>
        <p className="text-primary text-xs md:text-sm">{label}</p>
        <p className="text-sm font-medium md:text-base">{value}</p>
      </div>
    </div>
  )
}
